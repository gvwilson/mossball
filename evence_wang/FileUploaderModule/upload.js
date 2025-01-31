function render({ model, el }) {
    const container = document.createElement("div");
    container.className = "upload-container";

    // Drop zone elements
    const dropZone = document.createElement("div");
    dropZone.className = "drop-zone";

    const statusIcon = document.createElement("div");
    statusIcon.className = "status-icon";

    const text = document.createElement("div");
    text.className = "upload-text";
    text.innerHTML = `
        <span class="main-text">Drag & Drop Files</span>
        <span class="sub-text">or click to browse</span>
    `;

    // File list container
    const fileList = document.createElement("div");
    fileList.className = "file-list";

    // Progress bar and file input
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    if (model.get("multiple")) fileInput.multiple = true;

    // Assemble components
    dropZone.appendChild(statusIcon);
    dropZone.appendChild(text);
    container.appendChild(dropZone);
    container.appendChild(fileList);
    container.appendChild(fileInput);
    el.appendChild(container);

    let isUploading = false;

    // Event handlers
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    for (const eventName of ['dragenter', 'dragover']) {
        dropZone.addEventListener(eventName, e => {
            preventDefaults(e);
            if (!isUploading) dropZone.classList.add('dragover');
        });
    };

    for (const eventName of ['dragleave', 'drop']) {
        dropZone.addEventListener(eventName, e => {
            preventDefaults(e);
            dropZone.classList.remove('dragover');
        });
    };

    // File processing
    async function handleFiles(rawFiles) {
        if (isUploading) return;
        isUploading = true;

        const isMultiple = model.get("multiple");
        const currentFiles = model.get("files") || [];

        let files = Array.from(rawFiles);
        if (!isMultiple) {
            files = files.slice(0, 1);
        }

        if (!isMultiple && currentFiles.length > 0) {
            const confirmReplace = confirm(
                `A file is already uploaded. Replace it with "${files[0].name}"?`
            );
            if (!confirmReplace) {
                isUploading = false;
                return;
            }
        }

        const newFiles = Array.from(files).map(file => ({
            id: crypto.randomUUID(),
            name: file.name,
            type: file.type,
            size: file.size,
            content: null,
            progress: 0,
            status: 'uploading'
        }));

        let targetFiles;
        if (!isMultiple && currentFiles.length > 0) {
            targetFiles = newFiles;
        } else {
            targetFiles = [...currentFiles, ...newFiles];
        }
        model.set("files", targetFiles);
        model.set("status", "uploading");
        model.save_changes();

        for (const newFile of newFiles) {
            const reader = new FileReader();
            await new Promise(resolve => {
                reader.onprogress = e => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        updateFileProgress(newFile.id, percent);
                    }
                };

                reader.onloadend = e => {
                    const content = e.target.result.split(',')[1];
                    completeFileUpload(newFile.id, content);
                    resolve();
                };
                reader.readAsDataURL(files[newFiles.indexOf(newFile)]);
            });
        }

        isUploading = false;
        checkAllUploadsComplete();
    }

    function updateFileProgress(fileId, progress) {
        const files = model.get("files").map(file =>
            file.id === fileId ? {...file, progress} : file
        );
        model.set("files", files);
        model.save_changes();
    }

    function completeFileUpload(fileId, content) {
        const files = model.get("files").map(file =>
            file.id === fileId ? {...file, content, progress: 100, status: 'complete'} : file
        );
        model.set("files", files);
        model.save_changes();
    }

    function checkAllUploadsComplete() {
        const allComplete = model.get("files").every(f => f.status === 'complete');
        model.set("status", allComplete ? 'complete' : 'waiting');
        model.save_changes();
    }

    // UI Updates
    function renderFileList() {
        fileList.innerHTML = '';
        for (const file of model.get("files")) {
            const fileItem = document.createElement("div");
            fileItem.className = "file-item";

            // File name and progress
            const leftSection = document.createElement("div");
            leftSection.className = "file-left";

            const fileName = document.createElement("span");
            fileName.className = "file-name";
            fileName.textContent = file.name;

            const progressBar = document.createElement("div");
            progressBar.className = "file-progress";
            const progressFill = document.createElement("div");
            progressFill.className = "progress-fill";
            progressFill.style.width = `${file.progress}%`;
            progressBar.appendChild(progressFill);

            leftSection.appendChild(fileName);
            leftSection.appendChild(progressBar);

            // Status and delete
            const rightSection = document.createElement("div");
            rightSection.className = "file-right";

            const statusIcon = document.createElement("div");
            statusIcon.className = `file-status ${file.status}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerHTML = "🗑️";
            deleteBtn.onclick = () => {
                const confirmDelete = confirm(`Are you sure you want to delete "${file.name}"?`);
                if (confirmDelete) {
                    const updatedFiles = model.get("files").filter(f => f.id !== file.id);
                    model.set("files", updatedFiles);
                    model.save_changes();
                    checkAllUploadsComplete();
                }
            };

            rightSection.appendChild(statusIcon);
            rightSection.appendChild(deleteBtn);

            fileItem.appendChild(leftSection);
            fileItem.appendChild(rightSection);
            fileList.appendChild(fileItem);
        };
    }

    // Event Listeners
    dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => handleFiles(e.target.files));

    model.on("change:files", renderFileList);
    model.on("change:status", () => {
        statusIcon.className = `status-icon ${model.get("status")}`;
    });

    // Initial render
    renderFileList();
}

export default { render };
