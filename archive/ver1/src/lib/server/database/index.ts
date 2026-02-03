import mongoose from 'mongoose';

const MONGO_URL = 'mongodb://127.0.0.1:27017/bowling-score?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.7'
const connection: { isConnected?: number } = {};

export const dbConnect = async () => {
    if (connection.isConnected) {
        console.log('이미 데이터 베이스가 연결 되어 있습니다.')
        return;
    }

    if (!MONGO_URL) {
        throw new Error('ERROR >> 연결 URL 확인')
    }

    const db = await mongoose.connect(MONGO_URL)

    connection.isConnected = db.connections[0].readyState
    console.log('데이터 베이스 연결 성공')
}