const express = require('express');
const app = express();
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({extended:false}));
app.set("view engine", "ejs");
app.set("views","./views");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2',
    accessKeyId: '',
    secretAccessKey: ''
})

app.get('/', (req, res) => {
    const params_scanStudent ={
        TableName: "StudentBai1",
    };
    docClient.scan(params_scanStudent,onScan)
    function onScan(err,data){
        if(err){
            console.log("Loi khi scan",JSON.stringify(err,null,2))
            res.send(err)
        }
        else{
            const list = data.Items
            console.log(list)
            res.render('trangchu', {list})
        }
    }
})

app.post('/add',(req,res)=>{    
    const id = req.body.masinhvien
    const ten = req.body.tensinhvien
    const ngaysinh = req.body.ngaysinh
    const params_add = {
    TableName: "StudentBai1",
    Item :{
        "id" : id,
        "masinhvien" : id,
        "tensinhvien" :ten,
        "ngaysinh":ngaysinh,  
       }
    }
    console.log(req);
    docClient.put(params_add,(err,data) =>{
        if(err){
            console.log("Loi khong the them  ",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Them thanh cong : ",JSON.stringify(data,null,2))
            return res.redirect('/')
        }
    })
})

app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    const params_deleteStudent = {
        TableName :"StudentBai1",
        Key:{
            "id":id
        }
    };
    docClient.delete(params_deleteStudent,(err,data)=>{
        if(err){
            console.log("Loi khi xoa !!!",JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("Xoa thanh cong!!!",JSON.stringify(data,null,2))
            return res.redirect('/')
        }
    })
})
app.get('/update/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    var params = {
        TableName: "StudentBai1",
        Key: {
            "id":id
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            const item = data.Item
            console.log(item)
            res.render('update', {item})
        }
    })
})

app.post('/update',(req,res)=>{
    const id = req.body.id
    const masinhvien = req.body.masinhvien
    const tensinhvien = req.body.tensinhvien
    const ngaysinh = req.body.ngaysinh

    const params_updateStudent ={
        TableName:"StudentBai1",
        Key:{
            "id":id
        },
        UpdateExpression: "set masinhvien= :masinhvien, tensinhvien = :tensinhvien, ngaysinh = :ngaysinh ",
        ExpressionAttributeValues:{
            ":masinhvien": masinhvien,
            ":tensinhvien":tensinhvien,
            ":ngaysinh":ngaysinh,
        },
        ReturnValues:"UPDATED_NEW"
    }
    docClient.update(params_updateStudent,(err,data) =>{
        if(err){
            console.log("Loi khi update: " , JSON.stringify(err,null,2))
            return res.json({msg:"false"})
        }
        else{
            console.log("update sinh vien thanh cong!!!",JSON.stringify(err,null,2))
            return res.redirect('/')
        }
    })
})

app.get("/timKiem",(req,res)=>{
    const tensinhvien = req.body.tensinhvien;
    const params = {
        TableName : "StudentBai1",
        FilterExpression: "contains(tensinhvien, :tensinhvien)",
        ExpressionAttributeValues:{
            ":tensinhvien" : tensinhvien
        },
    };
    docClient.scan(params,(error,data)=>{
        if(error)
            console.log(error);
        else 
            res.render("trangchu",{
                list: data.Items
                
            });
    });
});

app.post("/timKiem2",(req,res)=>{
    const tensinhvien = req.body.tensinhvien;
    const params = {
        TableName : "StudentBai1",
        FilterExpression: "tensinhvien = :tensinhvien",
        ExpressionAttributeValues:{
            ":tensinhvien":tensinhvien
        },
    };
    docClient.scan(params,(error,data)=>{
        if(error)
            console.log(error);
        else 
            res.render("trangchu",{
                list : data.Items
            });
    });
})

app.listen(3000, () => console.log(`Server connected port 3000`))
