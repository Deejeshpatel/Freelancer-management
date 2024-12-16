const Project = require('../models/Project');
const { parseCSV, generateCSV } = require('../config/csv');

exports.createProject = async (req, res) => {
    try {
        const { name, duedate, status } = req.body;
        const project = new Project({ name, duedate, status });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: 'Project creation failed' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};


exports.updateProject = async (req, res) => {
    try {
        const { name, duedate, status } = req.body;
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { name, duedate, status },
            { new: true }
        );
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update project' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

exports.exportProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        const csv = generateCSV(projects);
        res.header('Content-Type', 'text/csv');
        res.attachment('projects.csv').send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Failed to export projects' });
    }
};

exports.importProjects = async (req, res) => {
    try {
        const projects = await parseCSV(req.file.path);
        await Project.insertMany(projects);
        res.json({ message: 'Projects imported successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to import projects' });
    }
};