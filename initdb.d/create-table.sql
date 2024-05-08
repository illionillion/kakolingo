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
),
(
    -- 問題文
    '5本のくじがあり，そのうち2本が当たりである。くじを同時に2本引いたとき，2本とも当たりである確率は幾らか。',
    -- 問題のジャンル
    '応用数学',
    -- 元の問題番号
    4,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q4.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
),
(
    -- 問題文
    'バブルソートの説明として，適切なものはどれか。',
    -- 問題のジャンル
    'アルゴリズム',
    -- 元の問題番号
    8,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q8.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
),
(
    -- 問題文
    'アクセス時間の最も短い記憶装置はどれか。',
    -- 問題のジャンル
    'メモリ',
    -- 元の問題番号
    13,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q13.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'イ'
),
(
    -- 問題文
    '毎分6,000回転，平均位置決め時間20ミリ秒で，1トラック当たりの記憶容量20kバイトの磁気ディスク装置がある。1ブロック4kバイトのデータを1ブロック転送するのに要する平均アクセス時間は何ミリ秒か。ここで，磁気ディスクコントローラーのオーバーヘッドは無視できるものとし，1kバイト＝1,000バイトとする。',
    -- 問題のジャンル
    '入出力装置',
    -- 元の問題番号
    14,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q14.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
),
(
    -- 問題文
    '3層クライアントサーバシステムの各層の役割のうち，適切なものはどれか。',
    -- 問題のジャンル
    'システムの構成',
    -- 元の問題番号
    16,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q16.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
),
(
    -- 問題文
    '仮想記憶管理におけるページ置換えアルゴリズムとしてLRU方式を採用する。主記憶のページ枠が，4000，5000，6000，7000番地(いずれも16進数)の4ページ分で，プログラムが参照するページ番号の順が，1→2→3→4→2→5→3→1→6→5→4のとき，最後の参照ページ4は何番地にページインされているか。ここで，最初の1→2→3→4の参照で，それぞれのページは4000，5000，6000，7000番地にページインされるものとする。',
    -- 問題のジャンル
    'オペレーティングシステム',
    -- 元の問題番号
    17,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q17.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'ウ'
),
(
    -- 問題文
    '仮想記憶におけるページ置換えアルゴリズムの一つであるLRUを説明した記述はどれか。',
    -- 問題のジャンル
    'オペレーティングシステム',
    -- 元の問題番号
    18,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q18.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'エ'
),
(
    -- 問題文
    'Hadoopの説明はどれか。',
    -- 問題のジャンル
    'ミドルウェア',
    -- 元の問題番号
    19,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/04_menjo/q19.html',
    -- 外部キー（過去問年度テーブル）
    1,
    -- 正解選択肢
    'エ'
),
(
    -- 問題文
    '0以上65,536未満の整数xを，16ビットの2進数で表現して，上位8ビットと下位8ビットを入れ替える。得られたビット列を2進数とみなしたとき，その値をxを用いた式で表したものはどれか。ここで，a÷bはaをbで割った商の整数部分を，a％bはaをbで割った余りを表す。また，式の中の数値は10進法である。',
    -- 問題のジャンル
    '離散数学',
    -- 元の問題番号
    2,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/03_menjo/q2.html',
    -- 外部キー（過去問年度テーブル）
    2,
    -- 正解選択肢
    'イ'
),
(
    -- 問題文
    '多数のクライアントが，LANに接続された1台のプリンターを共同利用するときの印刷要求から印刷完了までの所要時間を，待ち行列理論を適用して見積もる場合について考える。プリンターの運用方法や利用状況に関する記述のうち，M/M/1の待ち行列モデルの条件に',
    -- 問題のジャンル
    '応用数学',
    -- 元の問題番号
    5,
    -- 元の問題のURL
    'https://www.fe-siken.com/kakomon/03_menjo/q5.html',
    -- 外部キー（過去問年度テーブル）
    2,
    -- 正解選択肢
    'イ'
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
),
(
    -- 選択肢内容
    '1/25',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    3
),
(
    '1/20',
    'イ',
    3
),
(
    '1/10',
    'ウ',
    3
),
(
    '4/25',
    'エ',
    3
),
(
    -- 選択肢内容
    'ある間隔おきに取り出した要素から成る部分列をそれぞれ整列し，更に間隔を詰めて同様の操作を行い，間隔が1になるまでこれを繰り返す。',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    4
),
(
    '中間的な基準値を決めて，それよりも大きな値を集めた区分と，小さな値を集めた区分に要素を振り分ける。次に，それぞれの区分の中で同様の操作を繰り返す。',
    'イ',
    4
),
(
    '隣り合う要素を比較して，大小の順が逆であれば，それらの要素を入れ替えるという操作を繰り返す。',
    'ウ',
    4
),
(
    '未整列の部分を順序木にし，そこから最小値を取り出して整列済の部分に移す。この操作を繰り返して，未整列の部分を縮めていく。',
    'エ',
    4
),
(
    -- 選択肢内容
    'CPUの2次キャッシュメモリ',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    5
),
(
    'CPUのレジスタ',
    'イ',
    5
),
(
    '磁気ディスク',
    'ウ',
    5
),
(
    '主記憶',
    'エ',
    5
),
(
    -- 選択肢内容
    '20',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    6
),
(
    '22',
    'イ',
    6
),
(
    '27',
    'ウ',
    6
),
(
    '32',
    'エ',
    6
),
(
    -- 選択肢内容
    'データベースアクセス層は，データを加工してプレゼンテーション層に返信する。',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    7
),
(
    'ファンクション層は，データベースアクセス層で組み立てられたSQL文を解釈する。',
    'イ',
    7
),
(
    'ファンクション層は，データを加工してプレゼンテーション層に返信する。',
    'ウ',
    7
),
(
    'プレゼンテーション層は，データベースアクセス層にSQL文で問い合わせる。',
    'エ',
    7
),
(
    -- 選択肢内容
    '4000',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    8
),
(
    '5000',
    'イ',
    8
),
(
    '6000',
    'ウ',
    8
),
(
    '7000',
    'エ',
    8
),
(
    -- 選択肢内容
    'あらかじめ設定されている優先度が最も低いページを追い出す。',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    9
),
(
    '主記憶に存在している時間が最も長いページを追い出す。',
    'イ',
    9
),
(
    '主記憶に存在している時間が最も短いページを追い出す。',
    'ウ',
    9
),
(
    '最も長い間参照されていないページを追い出す。',
    'エ',
    9
),
(
    -- 選択肢内容
    'JavaEE仕様に準拠したアプリケーションサーバ',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    10
),
(
    'LinuxやWindowsなどの様々なプラットフォーム上で動作するWebサーバ',
    'イ',
    10
),
(
    '機能の豊富さが特徴のRDBMS',
    'ウ',
    10
),
(
    '大規模なデータセットを分散処理するためのソフトウェアライブラリ',
    'エ',
    10
),
(
    -- 選択肢内容
    '(x÷256)＋(x％256)',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    11
),
(
    '(x÷256)＋(x％256)×256',
    'イ',
    11
),
(
    '(x÷256)×256＋(x％256)',
    'ウ',
    11
),
(
    '(x÷256)×256＋(x％256)×256',
    'エ',
    11
),
(
    -- 選択肢内容
    '一部のクライアントは，プリンターの空き具合を見ながら印刷要求する。',
    -- 選択肢の記号
    'ア',
    -- 外部キー（過去問テーブル）
    12
),
(
    '印刷の緊急性や印刷量の多少にかかわらず，先着順に印刷する。',
    'イ',
    12
),
(
    '印刷待ちの文書データの総量がプリンターのバッファサイズを超えるときは，一時的に受付を中断する。',
    'ウ',
    12
),
(
    '一つの印刷要求から印刷完了までの所要時間は，印刷の準備に要する一定時間と，印刷量に比例する時間の合計である。',
    'エ',
    12
);