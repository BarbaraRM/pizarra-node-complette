module.exports = io => {
  // Mantiene almacenadas todas las lineas de los clientes
  let line_history = [];

  io.on('connection', socket => {
    
    for (let i in line_history) {
      socket.emit('dibujar_linea', {line: line_history[i].line});
    }

    socket.on('dibujar_linea', function(data) {
      line_history.push(data);
      io.emit('dibujar_linea', data);
    });

    socket.on('clean', function() {
      console.log('Pizarra Limpia');
      io.sockets.emit('clean', true);
    })
  });

};


