const express = require('express')
const router = express.Router()

const { getProjects, getProject, createProject, updateProject, deleteProject} = require('../controllers/projects')


//TODO: need to figure out how to protect these routes
router
    .route('/')
    .get(getProjects)

router
    .route('/:projectId')
    .get(getProject)
    //private route
    .put(updateProject)
    //private route
    .delete(deleteProject)

router
    .route('/:userID')
    //private route
    .post(createProject)
    



module.exports = router