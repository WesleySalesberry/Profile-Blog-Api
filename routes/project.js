const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/protect')

const { getProjects, getProject, createProject, updateProject, deleteProject} = require('../controllers/projects')


//TODO: need to figure out how to protect these routes
router
    .route('/')
    .get(getProjects)
    .post(protect, createProject)

router
    .route('/:projectId')
    .get(getProject)
    //private route
    .put(protect, updateProject)
    //private route
    .delete(protect, deleteProject)

// router
//     .route('/')
//     //private route
//     .post(protect, createProject)
    



module.exports = router