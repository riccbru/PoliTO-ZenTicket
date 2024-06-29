BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS "users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "admin" INTEGER NOT NULL CHECK ("admin" in (0, 1)) DEFAULT 0,
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,   
    "salt" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "tickets" (
    "ticket_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" INTEGER NOT NULL CHECK ("state" in (0, 1)) DEFAULT 1,
    "title" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "category" TEXT NOT NULL CHECK ("category" in ('administrative', 'inquiry', 'maintenance', 'new feature', 'payment')),
    "submission_time" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    FOREIGN KEY ("author_id") REFERENCES "users"("user_id")
);

CREATE TABLE IF NOT EXISTS "blocks" (
    "block_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticket_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "creation_time" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    FOREIGN KEY ("ticket_id") REFERENCES "tickets"("ticket_id"),
    FOREIGN KEY ("author_id") REFERENCES "users"("user_id")
);

INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(1, "cataldo_basile", "6ac5bf85b4597f20ef3b602065b4afd6427aa97c868e6798077cb6bffaf68683", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "antonio_di_scala", "45d3ffae800f6807896a512c8498171f31eae86a9937b1a353b3e5d112e9ac39", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(1, "antonio_lioy", "b6ec70ff46b0f12648755758854a771a70b8d90a5f1d5109d3bf78645a8224cb", "cccccccccccccccccccccccccccccccc");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(1, "enrico_masala", "b76b234366a2836c62e6469fe8aa0c7c4bc24f951b1399d397f2198c4f7df7bd", "dddddddddddddddddddddddddddddddd");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "marco_mellia", "a434bf51cbf4753f09023a66967871d160513523e7c47464e59ec95c916f76f8", "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "fulvio_valenza", "837bc96db7233f0b9e41af91c32684eb881413517655081235d6a22507d63c4c", "ffffffffffffffffffffffffffffffff");

INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(1, 'Deploy App', 4, 'inquiry', 1717952840, 'Do you guys have paid Google and Apple to deploy our new PoliTO mobile app?');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(0, 'PoliTO Network Security', 3, 'maintenance', 1717952841, 'There are some security vulnerabilities in PoliTO network, solve them yesterday or I am going to track your IP');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(1, 'Missing BTC payment', 2, 'payment', 1717952842, 'If my calculations are not wrong, I am sure somebody owes me some satoshis from last night dinner altogether. This is my BTC address: bc1q04pth2q24nkr5864fs3x7svadmy4gtyj7k9mkp');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(1, 'Mobile App PoliTO', 6, 'administrative', 1717952843, 'Do you like the new PoliTO mobile App?');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(0, 'Bug', 4, 'new feature', 1717952844, 'I am having some problems trying to fix a bug in our secret web app... Who did not respected the SPA architecture?');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(0, 'Crypto Exam', 2, 'inquiry', 1717952845, 'Should I be severe in first Cryptography exam on 07/01/24?');

INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(6, 3, 1717952846, 'Yes, cryptography is essential. These students are going to be the next SISR spies!!!');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(6, 1, 1717952847, 'We already issued a lot of CTFs during the semester.
I would say to go easy on them...');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(6, 4, 1717952848, 'The deadline for WebApp submission is 3 days before your exam. I am not sure they can be ready in 3 days.');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(5, 1, 1717952849, 'Sorry Enrico I was conducting some PT & VA with pwnthem0le on your Web App.

We are backing it up as we speak!');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(3, 6, 1717952850, 'Are you crazy? I am not doing a camurria to a colleague');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(3, 4, 1717952851, 'I hope you did not drink that much to forget I paid you beers in cash');
INSERT INTO "blocks" ("ticket_id", "author_id", "creation_time", "content") VALUES(3, 5, 1717952852, 'I was speaking to a PhD student I met at the pub. Not my business');

COMMIT;