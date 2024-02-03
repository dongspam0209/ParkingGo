ranges = {
    'A': 13,
    'B': 8,
    'C': 6,
    'D': 10,
    'E': 6,
    'F': 6,
    'G': 2,
    'H': 3,
    'I': 3
}

# SQL 문장들을 저장할 리스트
insert_statements = []

for letter, count in ranges.items():
    for i in range(1, count + 1):
        insert_statements.append(f'insert into parking_space (Ps_number, Ps_isOccupied, Parking_lot_Pl_id, Ps_best) values ("{letter}{i}", 0, 1, 0);')

# 파일에 쓰기
with open('parking_spaces.sql', 'w') as f:
    for statement in insert_statements:
        f.write(statement + '\n')
