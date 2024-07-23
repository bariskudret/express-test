const net = require('net');
const fs = require('fs');
const path = require('path');

const filereed=(path)=>{
  return  fs.readFileSync(path);
};

const istekTruruAyırıcı=(istekTuru) =>
{
const array = istekTuru.split(' ');
return{
    method : array[0],
    endpoint : array[1],
    version : array[2]
}
};

const dosyasecici=(metot, endPoint)=>{
    switch(endPoint)
    {
        case '/':
            if(metot === 'GET')
            return{
                url : './public/a.html',
                type : 'text/html'
        };
        case '/as':
            if(metot === 'POST')
            return {
                url : './public/b.html',
                type : 'text/html'
        };
        case '/a.css':
            return {
                type : 'text/css',
                url : './public/a.css'
            };
        default:
            return {
                type : -1,
                url : -1
            } ;
            
    }
}

const isteksecici= (istek) =>
{
    const _istek = istekTruruAyırıcı(istek);
    return endpointsecici(_istek.method, _istek.endpoint);
}

/**
 * 
 * @param {string} data 
 */
const hostParser=(data)=>
{
   return data.split(' ')[1];
}

const parser = (request)=>
{
const array = request.split('\r\n');

const istekturu = array[0];
const host = array[1];
const a = istekTruruAyırıcı(istekturu);
const b = dosyasecici(a.method, a.endpoint);
return {
    method : a.method,
    version : a.version,
    endPoint : a.endpoint,
    host : hostParser(host),
   file : b.url,
   type : b.type

}
}

const server = net.createServer(socket => {
    console.log('Client connected');
  
    socket.on('data', data => {
        
        console.log(data.toString());
      const result =  parser(data.toString());
      if(result.file === -1 )
      {
        socket.end();
        return;

      }
      console.log(result.file);
        const  file = filereed(result.file).toString();

        
    
       // socket.write('HTTP/1.1 200 OK\r\n');
        socket.write('HTTP/1.1 200 OK\r\n'+'Content-Type: ' +result.type+'\r\n'+'Content-Length: '+file.length +'\r\n\r\n'+ file);
        socket.end();// yanıtı bittiğini belirtiyor
       
    });
  
    socket.on('end', () => {
        console.log('Client disconnected');
    });
  
    socket.on('error', err => {
        console.error('Socket error:', err);
    });
}); 



const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
