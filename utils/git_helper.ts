import { exec } from "child_process";

export async function pushChanges(): Promise<void> {
	try {
		const basePath = (app.vault.adapter as any).basePath;

		await executeGitCommand(`git add .`, basePath);
		await executeGitCommand('git commit -m "Sync images"', basePath);

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
