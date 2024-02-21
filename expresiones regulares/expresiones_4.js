let texto = "(bla bla bla) [cosas entre corchetes] [otras cosas retorcidas)";

console.log(texto.match(/(\(|\[[a-z ]+(\)|\])/g)); 
                          