const http = require('http')
const fs = require('fs')

let books = [];
fs.readFile('./books.json', 'utf-8', (err, data) => {
    if(err) throw err
    books.push(...JSON.parse(data))
    // console.log(books)
}) 

const server = http.createServer((req, res) => {
    

    if(req.url === '/books' && req.method === 'GET'){ 
        res.writeHead(200, {
            'Content-Type': 'application/json charset=utf8'
        })       
        res.end(JSON.stringify({'books': books})) 
    }
    else if(req.url.match(/\/books\/\w+/) && req.method ==='GET'){
        const id = req.url.substring(req.url.lastIndexOf('/')+1)
        let found = false;
        for(i=0; i<books.length; i++){
            if(books[i].id ==id){
                found = true;
                res.writeHead(200, {
                    'Content-Type': 'application/json charset=utf8'
                })   
                res.end(JSON.stringify(books[i]))
            }            
        }
        if(!found){  
            res.end('Topilmadi')
        }
    }
    else if(req.url === '/books' && req.method ==='POST'){
        let body = '';
        req.on('data', (chunk) => {
            body+=chunk.toString() 
            const comingData = JSON.parse(body)

            let found = false;
            books.forEach((element, index) => {
                if(element.title == comingData.title){
                    found = true;
                }
            })

            if(found){
                res.end("Bu kitob bazada mavjud")
            } else{
                comingData.id = books[books.length-1].id + 1;
                console.log(comingData)
                books.push(comingData)
                console.log(books)
                fs.writeFileSync('./books.json', JSON.stringify(books))
                const response = {
                    status: 'created',
                    book: comingData
                }
                res.writeHead(200, {
                    'Content-Type': 'application/json charset=utf8'
                })   
                res.end(JSON.stringify(response))
            }
            
            
        })
    }
    
    else if(req.url.match(/\/books\/\w+/) && req.method ==='DELETE'){
        const id = req.url.substring(req.url.lastIndexOf('/')+1)
        let found = false;
        for(i=0; i<books.length; i++){
            if(books[i].id ==id){
                found = true;
                books.splice(i, 1);
                console.log(books);
                fs.writeFileSync('./books.json', JSON.stringify(books))
                const response = {
                    status: 'deleted',
                }
                res.writeHead(200, {
                    'Content-Type': 'application/json charset=utf8'
                })   
                res.end(JSON.stringify(response))
            }
        }
        if(!found){
            res.end('Ma\'lumot topilmadi')
        }
    }
    else if(req.url.match(/\/books\/\w+/) && req.method ==='PUT'){
        const id = req.url.substring(req.url.lastIndexOf('/')+1)
        let body = '';
        req.on('data', (chunk) => {
            body+=chunk.toString();
            const comingData = JSON.parse(body) 
            let found = false; 
            for(i=0; i<books.length; i++){
                if(books[i].id == id){
                    found = true;
                    books[i].title = comingData.title;
                    books[i].author = comingData.author;
                    console.log(books[i]);    
    
                    fs.writeFileSync('./books.json', JSON.stringify(books))
                    const response = {
                        status: 'updated',
                        id: books[i].id,
                        title: books[i].title,
                        author: books[i].author
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/json charset=utf8'
                    })   
                    res.end(JSON.stringify(response))
                }
            }
            if(!found){
                res.end("Ma'lumot topilmadi")
            }

        })
        
    }
    
})
 

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})