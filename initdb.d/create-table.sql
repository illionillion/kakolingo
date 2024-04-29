-- Windows環境で文字化け表示のために必要
SET CHARACTER SET utf8mb4;

-- ユーザーテーブル
create table users (
    user_id int auto_increment primary key,
    user_name varchar(32) not null unique,
    display_name varchar(255) not null,
    user_email varchar(255) not null unique,
    password varchar(255) not null,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ユーザーの初期データ追加
insert into users (user_name, display_name, user_email, password) values 
('atukinng', 'あつあつきんぐ', 'atuking@email.com', SHA2('password', 256)),
('yutosei', 'ゆうとうせい', 'yutosei@email.com', SHA2('password', 256)),
('akolingo', 'あこりんご', 'akolingo@email.com', SHA2('password', 256)),
('hironosuke', 'ひろのすけ', 'hironosuke@email.com', SHA2('password', 256)),
('kohe-penguin', 'こーへーぺんぎん', 'kohe-penguin@email.com', SHA2('password', 256));

-- アクセストークンの管理テーブル
CREATE TABLE access_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 過去問年度テーブル
create table past_questions_years (
    question_year_id int auto_increment primary key,
    created_year_jp varchar(10) not null, -- 出題年度（和暦）
    created_year int not null, -- 出題年度
    season varchar(10) default '' -- 出題時期（春:spring・秋:fall）
);

insert into past_questions_years (created_year_jp, created_year, season) values 
('令和4年', 2022, ''),
('令和3年', 2021, ''),
('令和2年', 2020, ''),
('令和元年', 2019, '秋'),
('平成31年', 2019, '春'),
('平成30年', 2018, '秋'),
('平成30年', 2018, '春');

-- 過去問テーブル
create table past_questions (
    question_id int auto_increment primary key,
    -- 問題文
    question_content varchar(255) not null,
    -- 問題のジャンル
    question_genre varchar(255) not null,
    -- 元の問題番号
    question_number int not null,
    -- 元の問題のURL
    question_url varchar(255) not null,
    -- 外部キー（過去問年度テーブル）
    question_year_id int not null,
    -- 正解選択肢
    correct_option_key varchar(10) not null,
    foreign key (question_year_id) references past_questions_years(question_year_id)
);

-- 過去問選択肢テーブル
create table question_options (
    option_id int auto_increment primary key,
    -- 選択肢内容
    option_content varchar(255) not null,
    -- 選択肢の記号
    option_key varchar(10) not null,
    -- 外部キー（過去問テーブル）
    question_id int not null,
    foreign key (question_id) references past_questions(question_id)
);

insert into past_questions 
(
    question_content,
    question_genre,
    question_number,
    question_url,
    question_year_id,
    correct_option_key
) values 
(
    -- 問題文
    '任意のオペランドに対するブール演算Aの結果とブール演算Bの結果が互いに否定の関係にあるとき，AはBの(又は，BはAの)相補演算であるという。排他的論理和の相補演算はどれか。',
    -- 問題のジャンル
    '離散数学',
    -- 元の問題番号
    1,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q1.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ア'
), 
(
    -- 問題文
    '2の補数で表された負数 10101110 の絶対値はどれか。',
    -- 問題のジャンル
    '離散数学',
    -- 元の問題番号
    2,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q2.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
);

insert into question_options 
(
    option_content,
    option_key,
    question_id
) values
(
    -- 選択肢内容
    '等価演算',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    1
),
(
    '否定論理和',
    'イ',
    1
),
(
    '論理積',
    'ウ',
    1
),
(
    '論理和',
    'エ',
    1
),
(
    -- 選択肢内容
    '01010000',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    2
),
(
    '01010001',
    'イ',
    2
),
(
    '01010010',
    'ウ',
    2
),
(
    '01010011',
    'エ',
    2
);