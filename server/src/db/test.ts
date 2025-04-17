import { connectDB, closeDB, client } from "../db/db.ts"; 

const main = async () => {
  try {
    await connectDB();

    const result = await client.queryObject("SELECT NOW()");
    console.log("Resultado:", result.rows);

  } catch (error) {
    console.error("Error al conectar o consultar:", error);
  } finally {
    await closeDB();
  }
};

main();
