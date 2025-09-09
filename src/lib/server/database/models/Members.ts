import mongoose, { model, Schema } from "mongoose";

const memberSchema = new Schema({
    name: { type: String, required: true },
    password: { type: Number, required: true },
    gender: { type: Boolean, default: false }, // false : M / true : W
    tel: { type: String },
    records: { type: Array },
    auth: { type: String, default: 'member' }
})

const Members = mongoose.models.Member || model('Members', memberSchema)

export default Members

const memberList = [{
    name: '양승우',
    password: '1234',
    tel: '01000002282',
    records: [],
    auth: 'master'
}, {
    name: '관리자',
    password: '1234',
    tel: '01000002282',
    records: [],
    auth: 'admin'
}, {
    name: '테스트1',
    password: '0001',
    tel: '01000000001',
    records: [],
    auth: 'member'
}, {
    name: '테스트2',
    password: '0002',
    tel: '01000000002',
    records: [],
    auth: 'member'
}, {
    name: '테스트3',
    password: '0003',
    tel: '01000000003',
    records: [],
    auth: 'member'
}, {
    name: '테스트4',
    password: '0004',
    tel: '01000000004',
    records: [],
    auth: 'member'
}, {
    name: '테스트5',
    password: '0005',
    tel: '01000000005',
    records: [],
    auth: 'member'
}, {
    name: '테스트6',
    password: '0006',
    tel: '01000000006',
    records: [],
    auth: 'member'
}, {
    name: '테스트7',
    password: '0007',
    tel: '01000000007',
    records: [],
    auth: 'member'
}, {
    name: '테스트8',
    password: '0008',
    tel: '01000000008',
    records: [],
    auth: 'member'
}, {
    name: '테스트9',
    password: '0009',
    tel: '01000000009',
    records: [],
    auth: 'member'
}, {
    name: '테스트10',
    password: '0010',
    tel: '01000000010',
    records: [],
    auth: 'member'
}, {
    name: '테스트11',
    password: '0011',
    tel: '01000000011',
    records: [],
    auth: 'member'
}]