const Joi = require('joi');
const express = require('express');
const app = require('express')();
const PORT = process.env.PORT || 8000;
app.use(express.json());

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)


const courses = [
    {id:1,name:'Introduction to Programming 1', major:'CS'},
    {id:2,name:'Introduction to Programming 2', major:'CS'},
    {id:3,name:'Logic Design', major:'EECS'},
    {id:4,name:'Electronics', major:'EE'},

];

app.get('/courses', (req,res)=>{
    res.status(200).send({
        courses
    })
});

app.get('/courses/:id',(req,res)=>{
   const course = courses.find(c => c.id == parseInt(req.params.id))
   if(!course) return res.status(404).send('The course with given ID was not found')
   res.send(course);
});


app.post('/courses',(req,res)=>{
    const result = validateCourse(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        major: req.body.major
    };
    courses.push(course);
    res.send(course);
});

app.put('/courses/:id',(req,res)=>{
    //look up course
    //if not found, return 404
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if(!course){
        return res.status(404).send('The course with given ID was not found')
    } 
    //validate
    //if invalid, return 400 - Bad request
    const result = validateCourse(req.body);
    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    //update course
    course.name = req.body.name;
    res.send(course);
    //return the updated course
})

app.delete('/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if(!course) return res.status(404).send('The course with given ID was not found')
    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course)



})


function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required(),
        major: Joi.string().min(1).required(),
        
    };
    return Joi.validate(course,schema);
}