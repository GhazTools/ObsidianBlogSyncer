import { exec } from "child_process";

export async function pushChanges(): Promise<void> {
	try {
		// Stage changes
		const basePath = (app.vault.adapter as any).basePath; // Removed the '/*' from basePath

		await executeGitCommand(`git add .`, basePath); // Use basePath as the working directory			// Commit changes
		await executeGitCommand('git commit -m "Sync images"', basePath);
		// Push changes
		await executeGitCommand("git push", basePath);
		console.log("Changes pushed successfully.");
	} catch (error) {
		console.error("Failed to push changes:", error);
	}
}

async function executeGitCommand(
	command: string,
	workingDirectory: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
			if (error) {
				console.error(
					`Error executing Git command in ${workingDirectory}:`,
					stderr
				);
				reject(error);
				return;
			}
			console.log(stdout);
			resolve();
		});
	});
}
