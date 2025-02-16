async function fetchGitHubTree(username, repo, branch = "main") {
    const url = `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch data:", response.statusText);
      return null; // Return null when fetch fails
    }
    const data = await response.json();
    return data.tree;
  }

  // Build a nested object tree.
  function buildTree(fileList) {
    let root = {};
    fileList.forEach(item => {
      let parts = item.path.split("/");
      let current = root;
      parts.forEach((part, i) => {
        if (i === parts.length - 1 && item.type === "blob") {
          current[part] = { type: "file", fullPath: item.path };
        } else {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });
    return root;
  }

  function getFileExtension(filename) {
const parts = filename.split(".");
return parts.length > 1 ? parts.pop().toLowerCase() : ""; // Ensure valid extension
}

function createTreeElement(treeData, parentElement) {
Object.keys(treeData).forEach(name => {
let li = document.createElement("li");

if (treeData[name].type && treeData[name].type === "file") {
li.classList.add("file");

// Extract file extension and add class
const fileExt = getFileExtension(name);
if (fileExt) {
li.classList.add(`file-${fileExt}`);
}

console.log(`File: ${name}, Class: file-${fileExt}`); // Debugging output

let link = document.createElement("a");
link.href = `https://github.com/wyndchyme/wyndchyme.github.io/blob/main/${treeData[name].fullPath}`;
link.textContent = name;
li.appendChild(link);
} else {
li.classList.add("folder");

let iconSpan = document.createElement("span");
iconSpan.classList.add("icon");

let labelSpan = document.createElement("span");
labelSpan.classList.add("label");
labelSpan.textContent = name;

li.appendChild(iconSpan);
li.appendChild(labelSpan);

let ul = document.createElement("ul");
createTreeElement(treeData[name], ul);
li.appendChild(ul);

[iconSpan, labelSpan].forEach(element => {
element.addEventListener("click", function(event) {
event.stopPropagation();
li.classList.toggle("open");
});
});
}
parentElement.appendChild(li);
});
}


  // Load and render the GitHub file tree
  async function loadGitHubFileTree() {
    const username = "wyndchyme";
    const repo = "wyndchyme.github.io";
    const branch = "main";

    const fileList = await fetchGitHubTree(username, repo, branch);
    
    const repoTree = document.getElementById("repoTree");
    repoTree.innerHTML = ""; // Clear previous content

    if (fileList === null) {
      const errorMessage = document.createElement("li");
      errorMessage.classList.add("error");
      errorMessage.textContent = "Failed to fetch data from GitHub.";
      repoTree.appendChild(errorMessage);
    } else {
      const treeData = buildTree(fileList);
      createTreeElement(treeData, repoTree);
    }
  }

  loadGitHubFileTree();