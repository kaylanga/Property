#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  commitMessage: process.argv[2] || 'Auto-commit: Update error handling',
  branch: 'development',
  remote: 'origin'
};

// Function to execute git commands
function executeGitCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main function
function autoCommit() {
  console.log('Starting auto-commit process...');
  
  // Check if there are changes to commit
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  
  if (!status) {
    console.log('No changes to commit.');
    return;
  }
  
  // Add all changes
  if (!executeGitCommand('git add .')) {
    console.error('Failed to add changes.');
    return;
  }
  
  // Commit changes
  if (!executeGitCommand(`git commit -m "${config.commitMessage}"`)) {
    console.error('Failed to commit changes.');
    return;
  }
  
  // Push changes
  if (!executeGitCommand(`git push ${config.remote} ${config.branch}`)) {
    console.error('Failed to push changes.');
    return;
  }
  
  console.log('Auto-commit completed successfully!');
}

// Run the auto-commit function
autoCommit(); 