#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');

const projectName = process.argv[2];

if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
    console.error(`Project directory ${projectName} already exists.`);
    process.exit(1);
}

fs.mkdirSync(projectPath, { recursive: true });

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

async function downloadHTMX(dest) {
    const url = 'https://unpkg.com/htmx.org/dist/htmx.min.js';
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(dest);

    return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on('error', (err) => {
            error = err;
            writer.close();
            reject(err);
        });
        writer.on('close', () => {
            if (!error) {
                resolve(true);
            }
        });
    });
}

function updatePackageJson(projectPath, projectName) {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJsonTemplate = fs.readFileSync(
        path.join(__dirname, 'template', 'package.json'),
        'utf8'
    );
    const updatedPackageJson = packageJsonTemplate.replace(
        '{{PROJECT_NAME}}',
        projectName
    );
    fs.writeFileSync(packageJsonPath, updatedPackageJson);
}

copyRecursiveSync(path.join(__dirname, 'template'), projectPath);
updatePackageJson(projectPath, projectName);

async function setupProject() {
    const htmxPath = path.join(projectPath, 'public', 'htmx.min.js');
    try {
        await downloadHTMX(htmxPath);
        console.log('HTMX downloaded successfully.');
    } catch (error) {
        console.error('Error downloading HTMX:', error);
        process.exit(1);
    }

    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    console.log(`Project ${projectName} created successfully.`);
    console.log(`Run the following commands to get started:`);
    console.log(`cd ${projectName}`);
    console.log(`npm start`);
}

setupProject();
