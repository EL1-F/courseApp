const newCourse = document.getElementById('new-course');
let title = document.getElementById('title');
let instructor = document.getElementById('instructor');
let image =document.getElementById('image');
const list = document.getElementById('course-list');
const row = document.querySelector('.row')

class Course{
    constructor(title,instructor,image){
        this.courseId = Math.floor(Math.random()*10000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    };
};

class UI{

    addCourseToList(course) {
        var html = `
            <tr>
                <td><img style="max-width:70%;height: auto;" src="img/${course.image}"/></td>
                <td>${course.title}</td>
                <td>${course.instructor}</td>
                <td><a href='#' data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</td>
            </tr>
        `;
    
        list.innerHTML+=html;
    };

    clearControls() {
        title.value = "";
        instructor.value = "";
        image.value = "";
    };

    deleteCourse(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
            return true;
        };
    };

    showAlert(message,className) {
        var alert = `
            <div class="alert alert-${className}">
                ${message}
            </div>
        `;
    
        row.insertAdjacentHTML('beforebegin',alert);
    
        setTimeout(()=>{
            document.querySelector('.alert').remove()
        },2500);
    };
};

class Storage{
    static getCourse(){

        let courses;
        if (localStorage.getItem('courses')===null) {
            courses=[];
        }else{
            courses = JSON.parse(localStorage.getItem('courses'));
        }

        return courses;

    };

    static displayCourses(){
        const courses = Storage.getCourse();

        courses.forEach(course => {
            const ui = new UI();
            ui.addCourseToList(course);
        });
    };

    static addCourse(course){
        const courses =Storage.getCourse();
        courses.push(course);
        localStorage.setItem('courses',JSON.stringify(courses));
    };

    static deleteCourse(element){
        if (element.classList.contains('delete')) {
            const id = element.getAttribute('data-id');

            const courses =Storage.getCourse();

            courses.forEach((course,index) => {
                
                if (course.courseId == id) {
                    courses.splice(index,1);
                }
            });

            localStorage.setItem('courses',JSON.stringify(courses));
        };
    };
};

document.addEventListener('DOMContentLoaded',Storage.displayCourses);

newCourse.addEventListener('submit',function(e){

    const titleValue = title.value;
    const instructorValue = instructor.value;
    const imageValue = image.value;

    //creat course obj.
    const course = new Course(titleValue,instructorValue,imageValue);
    const ui = new UI();

    if (titleValue == '' || instructorValue==''|| imageValue=='') {
        ui.showAlert('Please complate the form','warning')
    }else{

        //add the course to list

        ui.addCourseToList(course);

        //add to LS
        Storage.addCourse(course);
        ui.showAlert('The course has been added','success');

        //clear controls 

        ui.clearControls();
    }

    e.preventDefault();
});

list.addEventListener('click',function(e) {
    const ui = new UI();
    
    if (ui.deleteCourse(e.target) ==true) {
        Storage.deleteCourse(e.target);
        ui.showAlert('The course has been deleted','danger');
    };
    
});