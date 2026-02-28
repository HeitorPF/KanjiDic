import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Banco de dados conectado!");
    } catch (error) {
        console.error("Erro no banco:", error);
    }
};

export default connectDB;