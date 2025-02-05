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

            if (model.get("s3_enabled")) {
                const s3Status = document.createElement("div");
                s3Status.className = "s3-status";

                if (file.s3_uploaded) {
                    s3Status.textContent = `S3: ${file.s3_bucket}`;
                    s3Status.setAttribute("data-status", "success");
                } else if (file.s3_error) {
                    s3Status.textContent = `S3 Error: ${file.s3_error}`;
                    s3Status.setAttribute("data-status", "error");
                } else {
                    s3Status.textContent = "S3: Pending upload";
                    s3Status.setAttribute("data-status", "pending");
                }

                leftSection.appendChild(s3Status);
            }
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



    const s3Dialog = document.createElement("div");
    s3Dialog.className = "s3-dialog";
    s3Dialog.innerHTML = `
        <div class="s3-dialog-content">
            <div class="s3-dialog-header">
                <h3>S3 Configuration</h3>
                <span class="s3-dialog-close">&times;</span>
            </div>
            <div class="s3-dialog-body">
                <div class="s3-controls">
                    <div class="bucket-select-container">
                        <label>Select Bucket:</label>
                        <select class="bucket-select">
                            <option value="">Choose existing bucket...</option>
                            ${model.get("s3_buckets").map(b => `<option value="${b}">${b}</option>`).join("")}
                        </select>
                    </div>
                    <div class="bucket-divider">OR</div>
                    <div class="new-bucket-container">
                        <label>Create New Bucket:</label>
                        <input type="text" class="new-bucket-input" placeholder="Enter bucket name" />
                    </div>
                    <button class="refresh-buckets">🔄 Refresh Buckets</button>
                </div>
            </div>
        </div>
    `;

    // Create configuration button
    const configButton = document.createElement("button");
    configButton.className = "s3-config-button";
    configButton.textContent = "⚙️ Configure S3";
    configButton.style.display = model.get("s3_enabled") ? "block" : "none";

    // Add elements to DOM
    container.appendChild(configButton);
    container.appendChild(s3Dialog);
    el.appendChild(container);

    // Dialog control logic
    let isDialogOpen = false;

    function toggleDialog() {
        isDialogOpen = !isDialogOpen;
        s3Dialog.style.display = isDialogOpen ? "flex" : "none";
    }

    // Event listeners for dialog
    configButton.addEventListener("click", toggleDialog);

    s3Dialog.querySelector(".s3-dialog-close").addEventListener("click", toggleDialog);

    s3Dialog.addEventListener("click", (e) => {
        if (e.target === s3Dialog) toggleDialog();
    });

    // Connect form elements to model
    const bucketSelect = s3Dialog.querySelector(".bucket-select");
    const newBucketInput = s3Dialog.querySelector(".new-bucket-input");
    const refreshButton = s3Dialog.querySelector(".refresh-buckets");

    bucketSelect.addEventListener("change", () => {
        model.set("selected_bucket", bucketSelect.value);
        model.save_changes();
    });

    newBucketInput.addEventListener("input", () => {
        model.set("new_bucket_name", newBucketInput.value);
        model.save_changes();
    });

    refreshButton.addEventListener("click", () => {
        model.send({ method: "_refresh_buckets" });
    });

    // Update dialog when buckets change
    model.on("change:s3_buckets", () => {
        bucketSelect.innerHTML = `
            <option value="">Choose existing bucket...</option>
            ${model.get("s3_buckets").map(b => `<option value="${b}">${b}</option>`).join("")}
        `;
        bucketSelect.value = model.get("selected_bucket");
    });

    // Initial render
    renderFileList();
}

export default { render };
