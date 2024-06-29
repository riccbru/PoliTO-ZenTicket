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

INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(1, "cataldo_basile", "8edb607789f4301f20acbad430d81bcbdd69662fc96a2220a597eaecdb94bab5c40c272398c2f253f6a6d9a6495f79db18c28c73915f0c43ec64f9accfb53406", "0be9c2ea785d3b11af47beffe39df0a9");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "antonio_di_scala", "ee7c33e19fbda7f557c70bd8ba22f6486e574185f3b82a658690d448a417a2bfaaff268cf6f6a4bc8b041e2b93327ad3a94a59d6a25eb415615a6f196ae8b36d", "afa0e90ca6e19b4224d4a1795b16ebfe");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "antonio_lioy", "b317f7dd14f340c8aec82e6a36e919ead9b49fc223b16da1e9dde5ff8d99521b29703baf3286bf01bd9ddadd06d16039c849b7423af2bef5a1600cef87d56395", "f5873b18700a35c40e87229289720df5");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(1, "enrico_masala", "39fe25afc6faf6ac47383d755963e4e1cf0792097e14f825e630d17aa50e43b9ec189a130e78f519302e6736a870416808946d03334aada32a76470f81e2dcaa", "a04afc702d7e237924094c6dd6748860");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "marco_mellia", "9afc056296330e3e85599fe5dbe3fe1c702603ee8ad7cd1e1d31f39451edd44101b5aca83ae8144c3622da78d9c751ae631da16357d7527eb82bfdd1c5784775", "7726a84c9eb8616d0509e91caf31dcc8");
INSERT INTO "users" ("admin", "username", "hash", "salt") VALUES(0, "fulvio_valenza", "ccc259c9fbcef250b0cd5e4f2a836f371ee57ba40f888593a567763f3441b587adcf84e33c57f8d53557a9af43108471b7d177de3b4e1287d81424c26596d9d9", "cbd0fc17943c5c032ce06ae797e053b0");

INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(1, 'Deploy App', 4, 'inquiry', 1717952840, 'Do you guys have paid Google and Apple to deploy our new PoliTO mobile app?');
INSERT INTO "tickets" ("state", "title", "author_id", "category", "submission_time", "content") VALUES(0, 'PoliTO Network Security', 6, 'maintenance', 1717952841, 'There are some security vulnerabilities in PoliTO network, solve them yesterday or I am going to tell Prof. Lioy');
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