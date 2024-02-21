let texto = "hola hilo huauauauauauualo hole HoLa oLa HOLI";

console.log(texto.match(/\bh?[aeiou]{1,2}\b/gi)); //Captura la primera coincidencia y te devuelve dón de la ha encontrado
                            //al añadirle ( g i ) va a retornar un array con todas las coincidencias