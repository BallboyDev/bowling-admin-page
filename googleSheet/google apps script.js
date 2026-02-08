// function doGet(e) {
//   console.log('doGet >>', e)
//   return ContentService
//     .createTextOutput(JSON.stringify(e.parameter))
//     .setMimeType(ContentService.MimeType.JSON);
// }

const sheetData = {
    sheetId: '1iemL0ScgF9VwbUkRXhNkcBgIJJsrRiGElFJA72tfuKQ',
    memberList: '회원 명단',
    lastGame: 'lastGame',
    prize: '삼바리 금액'
}

const basicPoint = {
    memberList: [['A', 4], ['D', null]],
    activity: [['E', 4], ['G', null]],
    game: [['H', 4], [null, null]]
}

const setData = (data) => {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

const getHandle = {
    // 테스트 함수
    test: (e) => {
        const { number } = e.parameter
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        const data = sheet.getRange(`${basicPoint.memberList[0].join('')}:${sheet.getLastRow()}`).getValues()

        // findIndex + 3 + 1 => 데이터 테이블에서 변경할 row의 index 값 + 데이터 테이블 시작 위치 (A4) + sheet는 시작 값이 0이 아닌 1
        const index = data.findIndex((v) => { return `${v[0]}` === `${number}` }) + basicPoint.memberList[0][1]

        const [temp] = sheet.getRange(`H${index}:${index}`).getNotes()//.filter((v) => {return `${JSON.parse(v)['number'] || null}` === `${number}`})
        const notes = temp.filter((v) => {
            return v !== '' && `${JSON.parse(v)['number'] || null}` === `${number}`
            // return `${JSON.parse(v)['number'] || null}` === `${number}` 
        })


        return setData({ data, notes, index })
    },

    // 회원 리스트 조회
    getMembers: () => {
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        // 회원수 카운트 함수
        const data = sheet.getRange(`${basicPoint.memberList[0].join('')}:${basicPoint.activity[1][0]}${sheet.getLastRow()}`).getValues();

        const [title, ...rest] = data

        const json = []
        rest.map((v1) => {
            const temp = {}
            title.map((v2, i2) => {
                temp[v2] = v1[i2]
            })

            json.push(temp)
        })

        // return setData(data)
        return setData(json)
    },

    getMemberRecord: (e) => {
        const { number } = e.parameter
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        const data = sheet.getRange(`${basicPoint.memberList[0].join('')}:${sheet.getLastRow()}`).getValues()

        // findIndex + 3 + 1 => 데이터 테이블에서 변경할 row의 index 값 + 데이터 테이블 시작 위치 (A4) + sheet는 시작 값이 0이 아닌 1
        const index = data.findIndex((v) => { return `${v[0]}` === `${number}` }) + basicPoint.memberList[0][1]

        const [temp] = sheet.getRange(`H${index}:${index}`).getNotes()//.filter((v) => {return `${JSON.parse(v)['number'] || null}` === `${number}`})
        const notes = temp.filter((v) => {
            return v !== '' && `${JSON.parse(v)['number'] || null}` === `${number}`
        }).map((v) => { return JSON.parse(v) })

        return setData(notes)
    },

    getGames: () => {
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        const d1 = sheet.getRange(`${basicPoint.memberList[0].join('')}:${basicPoint.memberList[1][0]}${sheet.getLastRow()}`).getValues();
        const t = sheet.getRange(`H4:${sheet.getLastRow()}`).getValues()

        const size = t[0].filter((v) => { return (v !== "" || !!v) }).length
        const d2 = t.map((v1) => {
            return v1.slice(0, size)
        })

        const [dummy, ...data1] = d1
        const [title, ...data2] = d2

        const json = []
        title.map((v1, i1) => {
            const temp = {}
            data2.map((v2, i2) => {
                if (v2[i1] !== '' && v2[i1] !== 0 && !!v2[i1] && v2[i1] !== '-') {
                    temp[data1[i2][1]] = v2[i1]
                }
            })

            json.push({ ...temp, count: Object.keys(temp).length, title: v1 })
        })

        return setData(json)
    },

    getLastGame: (e) => {
        // const { lastGame } = e.parameter
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const record = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues();

        const data = record.map((v) => {
            return {
                '회원번호': v[0],
                'team': v[1],
                'betting': v[2],
                '이름': v[3],
                'game1': v[4],
                'game2': v[5],
                'game3': v[6],
                'game4': v[7],
                'sum': v[8],
                'avg': v[9],
            }
        })

        const metaData = sheet.getRange('A1:C1').getValues()

        return setData({
            lastGame: metaData[0][0],
            pattern: metaData[0][1],
            status: metaData[0][2],
            data: data
        })
    },

    getBettingPrize: () => {
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.prize);

        // const data = sheet.getRange(`A2:${sheet.getLastRow()}`).getValues()
        const temp = sheet.getDataRange().getValues()

        const json = {}
        const [title, ...data] = temp

        data.forEach((v1, i1) => {
            const [grade, ...prize] = v1

            prize.forEach((v2, i2) => {
                if (v2 !== '') {
                    json[title[i2 + 1]] = { ...json[title[i2 + 1]], [grade]: v2 }
                }
            })
        })

        return setData(json)
    },

    // 로그인 기능 관련
    login: (e) => {
        const { name, number } = e.parameter
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        const data = sheet.getRange(`${basicPoint.memberList[0].join('')}:${basicPoint.memberList[1][0]}${sheet.getLastRow()}`).getValues();
        // const data = sheet.getRange(5, 1, sheet.getRange('B2').getValue(), 3).getValues();

        const member = data.filter((v) => {
            return (v[0] === parseInt(number) && v[1] === name)
        })

        return setData(member)
    }
}

const postHandle = {
    addMember: (e) => {
        const { name, number, phone, etc } = e.parameter

        // 회원 관리 시트
        const sheet1 = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        // 개인 기록 시트

        // 회원 관리 시트 데이터 추가
        const lastRow = sheet1.getLastRow()

        // 회원 번호
        const memberNumber = number
        // 회원 이름
        const memberName = name
        // 회원 권한
        const grade = '회원'
        // 핸디캡
        const handicap = 0
        // 포인트
        const point = 0
        // 출석 횟수
        const attend = `=COUNTIFS(H${lastRow + 1}:${lastRow + 1}, "<>0", H${lastRow + 1}:${lastRow + 1}, "<>-")`
        // 평균점수
        const avg = `=IFERROR(AVERAGEIFS(H${lastRow + 1}:${lastRow + 1}, H${lastRow + 1}:${lastRow + 1}, "<>0", H${lastRow + 1}:${lastRow + 1}, "<>-"), 0)`


        // 회원번호 / 이름 / 권한 / 핸디캡 / 포인트 / 출석 (=COUNTIFS(H20:20, "<>0", H20:20, "<>-")) / 평균점수
        const result = sheet1.appendRow([memberNumber, memberName, grade, handicap, point, attend, avg])

        if (etc.trim().length !== 0) {
            sheet1.getRange(`B${lastRow}`).setNote(etc)

        }

        const [title, ...rest] = sheet1.getRange(`${basicPoint.memberList[0].join('')}:${basicPoint.activity[1][0]}${sheet1.getLastRow()}`).getValues()

        const json = []
        rest.map((v1) => {
            const temp = {}
            title.map((v2, i2) => {
                temp[v2] = v1[i2]
            })

            json.push(temp)
        })

        return setData({
            success: true,
            result,
            sheet: json
        })
    },
    updateMember: (e) => {
        const { number, name, auth, handicap, phone, point } = e.parameter

        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        const data = sheet.getRange(`${basicPoint.memberList[0].join('')}:${sheet.getLastRow()}`).getValues()

        // findIndex + 3 + 1 => 데이터 테이블에서 변경할 row의 index 값 + 데이터 테이블 시작 위치 (A4) + sheet는 시작 값이 0이 아닌 1
        const index = data.findIndex((v) => { return `${v[0]}` === `${number}` }) + basicPoint.memberList[0][1]

        const temp = sheet.getRange(`A${index}:G${index}`).getValues()
        sheet.getRange(`A${index}:E${index}`).setValues([[number, name, auth, handicap, point]])



        return setData({
            param: {
                number, name, auth, handicap, phone, point
            },
            data: {
                index,
                temp,
            }
        })
    },
    changeTeam: (e) => {
        const { number } = e.parameter
        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const temp1 = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues();
        const index = temp1.findIndex((v) => { return `${v[0]}` === `${number}` })

        // index + 2 + 1 => 데이터 테이블에서 변경할 row의 index 값 + 데이터 테이블 시작 위치 (A3) + sheet는 시작 값이 0이 아닌 1
        sheet.getRange(index + 2 + 1, 2).setValue(temp1[index][1] === 1 ? 2 : 1)

        const temp2 = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues();

        const data = temp2.map((v) => {
            return {
                '회원번호': v[0],
                'team': v[1],
                'betting': v[2],
                '이름': v[3],
                'game1': v[4],
                'game2': v[5],
                'game3': v[6],
                'game4': v[7],
                'sum': v[8],
                'avg': v[9],
            }
        })


        return setData({
            lastGame: sheetData.lastGame,
            data: data
        })
    },

    changeScore: (e) => {
        const { game, row, prevScore, currentScore } = e.parameter
        const player = JSON.parse(row)

        const gameCol = {
            game1: { num: 4, char: "E" },
            game2: { num: 5, char: "F" },
            game3: { num: 6, char: "G" },
            game4: { num: 7, char: "H" },
        }

        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const scores = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues();

        const gameRow = scores.findIndex((v) => { return `${v[0]}` === `${player["회원번호"]}` })

        let data = null
        if (scores[gameRow][gameCol.game1.num] !== currentScore) {
            sheet.getRange(`${gameCol[game]["char"]}${gameRow + 3}`).setValue(currentScore)

            data = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues().map((v) => {
                return {
                    '회원번호': v[0],
                    'team': v[1],
                    'betting': v[2],
                    '이름': v[3],
                    'game1': v[4],
                    'game2': v[5],
                    'game3': v[6],
                    'game4': v[7],
                    'sum': v[8],
                    'avg': v[9],
                }
            })
        }

        return setData({
            param: { row: player, prevScore, currentScore },
            data: {
                // scores,
                gameRow,
                changePos: `${gameCol[game]["char"]}${gameRow + 3}`,
                score: scores[gameRow][gameCol[game]["num"]],
                scores: data
            }
        })
    },

    updateScore: (e) => {
        const { number, game, currentScore } = e.parameter
        const gameCol = {
            game1: 'E',
            game2: 'F',
            game3: 'G',
            game4: 'H',
        }

        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const gameRows = sheet.getRange(`A3:A${sheet.getLastRow()}`).getValues().findIndex((v) => { return `${v[0]}` === `${number}` });

        let score = 0
        let record = null
        if (`${sheet.getRange(`${gameCol[game]}${gameRows + 3}`).getValue()}` !== `${currentScore}`) {
            score = sheet.getRange(`${gameCol[game]}${gameRows + 3}`).setValue(currentScore).getValue()
            record = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues().map((v) => {
                return {
                    '회원번호': v[0],
                    'team': v[1],
                    'betting': v[2],
                    '이름': v[3],
                    'game1': v[4],
                    'game2': v[5],
                    'game3': v[6],
                    'game4': v[7],
                    'sum': v[8],
                    'avg': v[9],
                }
            })
        }

        return setData({
            data: {
                changeScore: score,
                record
            }
        })

    },

    joinBetting: (e) => {
        const { game, playerInfo } = e.parameter
        const player = JSON.parse(playerInfo)

        const sheet = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const scores = sheet.getRange(`A3:${sheet.getLastRow()}`).getValues();

        const gameRow = scores.findIndex((v) => { return `${v[0]}` === `${player["회원번호"]}` })
        const betting = [...new Set([...`${scores[gameRow][2]}`.split('|').filter((v) => { return v !== "" || !!v }), ...game.split('|')])].join('|')

        sheet.getRange(`C${gameRow + 3}`).setValue(betting)

        const lastGame = getHandle.getLastGame()



        return setData({
            param: {
                game, player
            },
            data: {
                scores,
                gameRow,
                betting
            },
            lastGame
        })
    },

    createNewGame: (e) => {
        const { title, pattern, memberList, guestList } = e.parameter
        const members = JSON.parse(memberList)
        const guests = JSON.parse(guestList)
        const sheet2 = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const players = [...members, ...guests].map((v) => {
            return [
                v['회원번호'],
                v['team'],
                v['betting'],
                v['이름'],
                v['game1'],
                v['game2'],
                v['game3'],
                v['game4'],
            ]
        })

        const insertData = [
            [title, pattern, 'before', '', '', '', '', ''],
            ['number', 'team', 'betting', 'name', 'g1', 'g2', 'g3', 'g4'],
            ...players
        ]

        sheet2.getDataRange().clear()
        const testSheet = sheet2.getRange(1, 1, insertData.length, 8).setValues(insertData)

        return setData({
            lastGame: title,
            pattern: pattern,
            status: 'before',
            players: players,
            data: insertData
        })
    },
    newGameSave: (e) => {
        // 회원 명단 시트
        const sheet1 = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.memberList);

        // 마지막 게임 시트
        const sheet2 = SpreadsheetApp
            .openById(sheetData.sheetId)
            .getSheetByName(sheetData.lastGame);

        const metaData = sheet2.getRange('A1:C1').getValues()
        const record = sheet2.getRange(`A3:${sheet2.getLastRow()}`).getValues();

        const temp = record.map((v) => {
            const sum = v[4] + v[5] + v[6] + v[7]
            const div =
                (v[4] === 0 ? 0 : 1) +
                (v[5] === 0 ? 0 : 1) +
                (v[6] === 0 ? 0 : 1) +
                (v[7] === 0 ? 0 : 1);
            return {
                '회원번호': v[0],
                '이름': v[2],
                'note': JSON.stringify({
                    title: metaData[0][0],
                    number: v[0],
                    name: v[2],
                    g1: v[4],
                    g2: v[5],
                    g3: v[6],
                    g4: v[7],
                    total: sum,
                    avg: ((div === 0) ? 0 : (sum / div))
                }),
                'avg': ((div === 0) ? 0 : (sum / div))
            }
        })

        const [sheet1_title, ...sheet1_data] = sheet1.getRange(`${basicPoint.memberList[0].join('')}:${basicPoint.activity[1][0]}${sheet1.getLastRow()}`).getValues();

        // 데이터 입력 - 회원 명단
        const lastColData1 = [[metaData[0][0]], ...sheet1_data.map((v1) => {
            const index = temp.findIndex((v2) => { return `${v1[0]}` === `${v2['회원번호']}` })
            return [index >= 0 ? temp[index]['avg'] : '-']
        })]
        // 게임별 점수 메모로 저장
        const lastColData2 = [[metaData[0][0]], ...sheet1_data.map((v1) => {
            const index = temp.findIndex((v2) => { return `${v1[0]}` === `${v2['회원번호']}` })
            return [index >= 0 ? temp[index]['note'] : '',]
        })]

        // 회원 명단 업데이트 코드
        sheet1.getRange(basicPoint.memberList[0][1], sheet1.getLastColumn() + 1, sheet1.getLastRow() - basicPoint.memberList[0][1] + 1, 1).setValues(lastColData1).setNotes(lastColData2)

        // lastGame 상태 변경 (before => after)
        sheet2.getRange('C1').setValue('after')

        return setData({
            lastGame: metaData[0][0],
            pattern: metaData[0][1],
            status: 'after',
            data: record.map((v) => {
                return {
                    '회원번호': v[0],
                    'team': v[1],
                    'betting': v[2],
                    '이름': v[3],
                    'game1': v[4],
                    'game2': v[5],
                    'game3': v[6],
                    'game4': v[7],
                    'sum': v[8],
                    'avg': v[9]
                }
            }),
        })
    }
}

const doGet = (e) => getHandle[e.parameter.action](e)
const doPost = (e) => postHandle[e.parameter.action](e)
