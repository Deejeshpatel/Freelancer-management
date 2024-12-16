const express = require('express');
const multer = require('multer');
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    exportProjects,
    importProjects
} = require('../controllers/projectController');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/export', exportProjects);
router.post('/import', upload.single('file'), importProjects);

module.exports = router;