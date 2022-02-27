import Vue from 'vue'
import Router from 'vue-router'
// import LoginComponent from '../components/Auth/LoginComponent'

Vue.use(Router)
export const routes = [
    // {
    //     path: '/login',
    //     component: LoginComponent,
    //     name: 'Login',
    //     group: 'default',
    //     icon: '',
    //     type: 'not-page',
    //     key: ''
    // },
    /**
      * Error Pages
      */
    // {path: '*', component: NotFoundComponent, 'name': 'error.404',},
    // {path: '/unauthorized', component: NotFoundComponent, 'name': 'error.403',},
    {
        path: '/',
        // component:DashboardComponent,
        name: 'Dashboard',
        group: 'default',
        icon: '',
        type: 'dashboard',
        key: ''
    },
    {
        path: '/course-management/all-courses',
        // component: IndexCourseComponent,
        name: 'Courses',
        group: 'course-managemnent',
        icon: '<i class="fas bi bi-calendar2-fill parent-nav-icon"></i>',
        type: 'page',
        key: 'course_access',
        meta: {
            permission: 'course_access'
        }
    },

    {
        path: '/course-management/create',
        // component: CreateCourseComponent,
        name: 'New Course',
        group: 'course-managemnent',
        icon: '<i class="fas fa-book parent-nav-icon"></i>',
        type: 'create',
        key: 'course_access',
        meta: {
            permission: 'course_create'
        }
    },
];