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
