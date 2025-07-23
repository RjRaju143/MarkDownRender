import express, { Request, Response } from "express";
import fs from 'fs/promises';
import { marked } from 'marked';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docFolder = path.join(__dirname, '../../doc');

router.get('/', async (_: Request, res: Response) => {
  try {
    const files = await fs.readdir(docFolder);
    const markdownFiles = files.filter((file: string) => file.endsWith('.md'));

    let fileList = '<h2>Available Files:</h2><ul>';
    markdownFiles.forEach((file: string) => {
      fileList += `<li><a href="/doc/${file}">${file}</a></li>`;
    });
    fileList += '</ul>';

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Docs</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        </style>
      </head>
      <body>
        ${fileList}
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).send('Error reading document directory');
  }
});

router.get('/doc/:filename', async (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(docFolder, filename);

  try {
    try {
      await fs.access(filePath);
    } catch (accessErr) {
      console.error('File not found:', filePath);
      return res.status(404).send('File not found');
    }

    const data = await fs.readFile(filePath, 'utf8');

    if (!data) {
      console.error('Error reading file: data is undefined');
      return res.status(500).send('Error reading Markdown file');
    }

    const htmlContent = marked.parse(data);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        </style>
      </head>
      <body>
        <a href="/">Back to Index</a>
        ${htmlContent}
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).send('Error reading Markdown file');
  }
});

export default router;
