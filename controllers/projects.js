const Project = require('../models/Project')
const handler = require('../middlewares/handler')

/**********************************************
 *   ✔: Return all projects
 *   ✔: Create a new project
 *   ✔: Update project
 *   ✔: Delete a project
************************************************/


// @desc   Get All Projects
// @route  GET /api/v1/project/
// @access Public
exports.getProjects = handler( async (req, res, next) => {
    let project = await Project.find().sort('-createdAt')
    res.status(200).json({
        success: true,
        data: project
    })
})

// @desc   Get Single Project
// @route  GET /api/v1/project/:id
// @access Public
exports.getProject = handler( async (req, res, next) => {
    const projectID = req.params.projectId
    const project = await Project.findById(projectID)
    res.status(200).json({
        success: true,
        data: project
    })
})


// @desc   Create A Projects
// @route  GET /api/v1/project/userID
// @access Private
exports.createProject = handler( async (req, res, next) => {
    const project = req.body
    const myProject = await Project.create(project)

    res.status(200).json({
        success: true,
        data: myProject
    })
})

// @desc   Update A Projects
// @route  GET /api/v1/project/:projectId
// @access Private
exports.updateProject = handler( async (req, res, next) => {
    const projectID = req.params.projectId
    const project = await Project.findById(projectID)
    
    if(!project){
        return next(
            new ErrorResponse(`Project not found with id of ${projectID}`, 404)
        )
    }
    project = await Project.findByIdAndUpdate(projectID, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: project
    })
})

// @desc   Delete A Projects
// @route  GET /api/v1/project/:projectId
// @access Private
exports.deleteProject = handler( async (req, res, next) => {
    const projectID = req.params.projectId
    const removedProject = await Project.findById(projectID)

    if(!project){
        return next(
            new ErrorResponse(`Project not found with id of ${projectID}`, 404)
        )
    }

    removedProject.remove()
    res.status(200).json({
        success: true,
        data: `Project with id ${projectID} has been deleted`
    })
})

