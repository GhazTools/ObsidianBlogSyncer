import { exec } from "child_process";

export async function pushChanges(): Promise<void> {
	try {
		const basePath = (app.vault.adapter as any).basePath;

		if (await checkForGitChanges(basePath)) {
			await executeGitCommand(`git add .`, basePath);
			await executeGitCommand('git commit -m "Sync images"', basePath);

			await executeGitCommand("git push", basePath);
			console.log("Changes pushed successfully.");
		}
	} catch (error) {
		console.log(
			"Failed to push changes, probably no changes to make:",
			error,
		);
	}
}

async function checkForGitChanges(basePath: string): Promise<boolean> {
	try {
		const output: string = await executeGitCommand("git status", basePath);

		if (output.includes("up to date")) {
			console.log("No changes to make");
			return true;
		}

		return false;
	} catch (error) {
		console.log("Error checking for Git changes: ", error);
		return false;
	}
}

function executeGitCommand(
	command: string,
	workingDirectory: string,
): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
			if (error) {
				console.error(
					`Error executing Git command in ${workingDirectory}:`,
					stderr,
				);
				reject(error);
				return;
			}
			console.log(stdout);
			resolve(stdout); // Resolve the promise with the command's output
		});
	});
}
