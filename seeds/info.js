 exports.seed = function(knex, Promise) {
  return knex('info').insert([
    {first: 'joe', last: 'parker', email: 'joe@joe.com', password:'beans', salt: '$2a$04$viNV9cjyWyAyVmWIQiLmDO'},
    {first: 'al', last: 'parker', email: 'al@al.com' , password: 'packers', salt: '$2a$04$TW0dZf8ulcaQsatUvoUU2e'},
  ]);
};