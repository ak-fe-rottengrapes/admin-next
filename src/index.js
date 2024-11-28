let prismaInstance = null;

export const initializeAdmin = (prismaClient) => {
  prismaInstance = prismaClient;
};

const getPrismaInstance = () => {
  if (!prismaInstance) {
    throw new Error('Please initialize admin-next using initializeAdmin(prismaClient)');
  }
  return prismaInstance;
};

export const GetAllModel = async (req) => {
    const prisma = getPrismaInstance();
    const query = req.nextUrl.searchParams;
    const modelName = query.get('modelName');
    const id = query.get('id');
    const page = parseInt(query.get('page') || '1')
    const limit = parseInt(query.get('limit') || '10')

    try {
        // const models = prisma.$dmmf.datamodel.models;
        // const allModels = models.map((model) => model.name.toLocaleLowerCase());

        // if (modelName && !allModels.includes(modelName)) {
        //     return Response.json({ message: `Model ${modelName} not found` }, { status: 404 });
        // }

        const result = await prisma.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public';
      `;
      const tableNamesArray = result.map(row => row.table_name);

        if (modelName) {
            if (id) {
                const data = await prisma[modelName].findUnique({
                    where: { id: Number(id) },
                });

                if (!data) {
                    return Response.json({ error: `${modelName} with id ${id} not found` }, { status: 404 });
                }
                return Response.json(data, { status: 200 });
            } else {
                const data = await prisma[modelName].findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                });

                const totalCount = await prisma[modelName].count();

                return Response.json({
                    data,
                    page,
                    limit,
                    totalCount,
                }, { status: 200 });
            }
        }

        return Response.json(tableNamesArray , { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: `Failed to fetch data: ${error.message}` }, { status: 500 });
    }
};

export const handlePost = async (req) => {
    const prisma = getPrismaInstance();
    const data = await req.json();
    const query = req.nextUrl.searchParams;
    const modelName = query.get('modelName')
    
    if (!modelName) {
        return Response.json({ error: 'modelName is required' }, { status: 400 });
    }

    try {
        await prisma[modelName].create({
            data,
        })
        return Response.json(data)
    } catch (error) {
        if (error.code === 'P2002') {
            const violatedFields = error.meta.target;

            const errorMessage = violatedFields
                .map(field => `${field} is already in use`)
                .join(", ");

            return Response.json({ error: errorMessage }, { status: 409 });
        }

        console.error(`Error creating ${modelName}:`, error);
        return Response.json({ error: `Failed to create ${modelName}: ${error.message}` }, { status: 500 });
    }
}

export const handleUpdate = async (req) => {
    const prisma = getPrismaInstance();
    const query = req.nextUrl.searchParams;
    const modelName = query.get('modelName')
    const id = Number(query.get('id'));
    const data = await req.json();
    
    if (!id || !modelName || !data) {
        return Response.json({ error: 'ID, modelName, and data are required' }, { status: 400 });
    }

    try {
        const existingRecord = await prisma[modelName].findUnique({
            where: { id },
        });

        if (!existingRecord) {
            return Response.json({ error: `${modelName} with id ${id} not found` }, { status: 404 });
        }

        const updatedRecord = await prisma[modelName].update({
            where: { id: Number(id) },
            data,
        });
        return Response.json(updatedRecord);
    } catch (error) {
        return Response.json({ error: `Failed to update ${modelName}: ${error.message}` }, { status: 500 });
    }
};

export const handleDelete = async (req) => {
    const prisma = getPrismaInstance();
    const query = req.nextUrl.searchParams;
    const modelName = query.get('modelName');
    const id = Number(query.get('id'));

    if (!id || !modelName) {
        return Response.json({ error: 'ID and modelName are required' }, { status: 400 });
    }

    try {
        const existingRecord = await prisma[modelName].findUnique({
            where: { id },
        });
        if (!existingRecord) {
            return Response.json(
                { error: `${modelName} with id ${id} not found` },
                { status: 404 }
            );
        }
        const deletedData = await prisma[modelName].delete({
            where: { id },
        });
        return Response.json(deletedData, { status: 200 });
    } catch (error) {
        return Response.json({ error: `Failed to delete ${modelName}: ${error.message}` }, { status: 500 })
    }
}