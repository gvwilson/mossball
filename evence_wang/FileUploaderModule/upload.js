// This is the class for the S3 window that pops up when the user clicks the "Configure S3" button
class S3DialogManager {
  constructor(container, model) {
    this.model = model;
    this.isDialogOpen = false;
    this.isFlipped = false;
    this.container = container;
    this.pendingBucket = null;
    this.createDialogElements();
    this.initializeEventListeners();
    this.updateBucketList();
    this.updateSelectedBucketText();
  }

  // This defines what the actual window looks like (and its flip side for creating the bucket)
  // And the two modals
  // One for confirming the creation of a bucket
  // The other for confirming the switch of a bucket
  createDialogElements() {
    this.configButton = document.createElement("button");
    this.configButton.className = "try-button";
    this.configButton.textContent = "⚙️ Configure S3";
    this.configButton.style.display = this.model.get("s3_enabled")
      ? "block"
      : "none";

    this.selectedBucketDisplay = document.createElement("span");
    this.selectedBucketDisplay.className = "instruction";
    this.updateSelectedBucketText();

    this.dialog = document.createElement("div");
    this.dialog.className = "s3-dialog";
    this.dialog.innerHTML = `
            <div class="s3-dialog-content">
                <div class="s3-dialog-header title">
                    <h3>S3 Configuration</h3>
                    <span class="s3-dialog-close">&times;</span>
                </div>
                <div class="s3-dialog-body">
                    <div class="card-container">
                        <div class="flip-card">
                            <div class="flip-card-front">
                                <div class="s3-controls">
                                    <div class="bucket-select-container">
                                        <label class="instruction">Select Bucket:</label>
                                        <select class="bucket-select">
                                            <option value="">Choose existing bucket...</option>
                                            ${this.model
                                              .get("s3_buckets")
                                              .map(
                                                (b) =>
                                                  `<option value="${b}">${b}</option>`
                                              )
                                              .join("")}
                                        </select>
                                        <button class="refresh-buckets">⭯ Refresh Buckets</button>
                                    </div>
                                    <div class="flip-button-container">
                                        <button class="flip-to-create">✚ Create New Bucket</button>
                                    </div>
                                </div>
                            </div>
                            <div class="flip-card-back">
                                <div class="s3-controls">
                                    <div class="new-bucket-container">
                                        <h4 class="instruction">Create New Bucket:</h4>
                                        <input type="text" class="new-bucket-input" placeholder="Enter bucket name">
                                        <button class="create-bucket-btn">Create Bucket</button>
                                    </div>
                                    <div class="flip-button-container">
                                        <button class="flip-to-select">🡄 Back to Bucket Selection</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="message-container"></div>
                </div>
            </div>
        `;

    // Modals for confirming bucket creation and bucket switch
    this.switchBucketModal = document.createElement("div");
    this.switchBucketModal.className = "confirmation-modal switch-bucket-modal";
    this.switchBucketModal.innerHTML = `
            <div class="confirmation-content">
                <h3>Confirm Bucket Switch</h3>
                <p>Switching buckets will clear all current files locally.<br>
                   Are you sure you want to switch to <span class="new-bucket-name"></span>?</p>
                <div class="confirmation-buttons">
                    <button class="switch-confirm-yes">Yes, Switch</button>
                    <button class="switch-confirm-no">Cancel</button>
                </div>
            </div>
        `;

    this.confirmationModal = document.createElement("div");
    this.confirmationModal.className = "confirmation-modal";
    this.confirmationModal.innerHTML = `
            <div class="confirmation-content">
                <h4>Confirm Bucket Creation</h4>
                <p>Are you sure you want to create bucket: <span class="bucket-name-confirm"></span>?</p>
                <div class="confirmation-buttons">
                    <button class="creation-confirm-yes">Yes, Create</button>
                    <button class="creation-confirm-no">Cancel</button>
                </div>
            </div>
        `;

    // Group the Configure S3 button with the selected bucket text
    const s3ConfigContainer = document.createElement("div");
    s3ConfigContainer.className = "s3-config-container";
    s3ConfigContainer.appendChild(this.configButton);
    s3ConfigContainer.appendChild(this.selectedBucketDisplay);

    this.container.appendChild(s3ConfigContainer);
    this.container.appendChild(this.dialog);
    this.container.appendChild(this.switchBucketModal);
    this.container.appendChild(this.confirmationModal);

    this.flipCard = this.dialog.querySelector(".flip-card");
    this.bucketSelect = this.dialog.querySelector(".bucket-select");
    this.newBucketInput = this.dialog.querySelector(".new-bucket-input");
    this.refreshButton = this.dialog.querySelector(".refresh-buckets");
    this.messageContainer = this.dialog.querySelector(".message-container");
  }

  initializeEventListeners() {
    this.configButton.addEventListener("click", () => this.toggleDialog());
    this.dialog
      .querySelector(".s3-dialog-close")
      .addEventListener("click", () => this.closeDialog());
    this.dialog.addEventListener("click", (e) => {
      if (e.target === this.dialog) this.closeDialog();
    });
    // Flipping the window
    this.dialog
      .querySelector(".flip-to-create")
      .addEventListener("click", () => {
        this.flipCard.classList.add("flipped");
        this.messageContainer.innerHTML = "";
      });
    this.dialog
      .querySelector(".flip-to-select")
      .addEventListener("click", () => {
        this.flipCard.classList.remove("flipped");
        this.messageContainer.innerHTML = "";
        this.newBucketInput.value = "";
      });

    // Bucket selection
    this.bucketSelect.addEventListener("change", () => {
      const newBucket = this.bucketSelect.value;
      const currentBucket = this.model.get("selected_bucket");
      if (currentBucket !== newBucket && this.model.get("files").length > 0) {
        this.pendingBucket = newBucket;
        this.showSwitchBucketConfirmation(newBucket);
      } else {
        if (currentBucket !== newBucket) {
          this.model.set("files", []);
        }
        this.model.set("selected_bucket", newBucket);
        if (newBucket !== "") {
          this.messageContainer.innerHTML =
            '<div class="success-message">Bucket selected successfully!</div>';
        }
        this.model.save_changes();
      }
    });

    this.model.on("change:selected_bucket", () =>
      this.updateSelectedBucketText()
    );

    // Button for creating a new bucket
    this.dialog
      .querySelector(".create-bucket-btn")
      .addEventListener("click", () => {
        const bucketName = this.newBucketInput.value.trim();
        if (!bucketName) {
          this.messageContainer.innerHTML =
            '<div class="error-message">Please enter a bucket name</div>';
          return;
        }
        this.showConfirmation(bucketName);
      });

    // Some handlers send messages to the Python backend and triggers a function call
    this.dialog
      .querySelector(".refresh-buckets")
      .addEventListener("click", () => {
        this.model.send({ method: "refresh_buckets" });
      });

    // Confirmation button handlers for creating a bucket and switching a bucket
    this.confirmationModal
      .querySelector(".creation-confirm-yes")
      .addEventListener("click", () => {
        const bucketName = this.newBucketInput.value.trim();
        this.model.send({ method: "create_bucket", bucket_name: bucketName });
        this.hideConfirmation();
      });

    this.confirmationModal
      .querySelector(".creation-confirm-no")
      .addEventListener("click", () => {
        this.hideConfirmation();
      });

    this.switchBucketModal
      .querySelector(".switch-confirm-yes")
      .addEventListener("click", () => {
        this.model.send({
          method: "switch_bucket",
          new_bucket: this.pendingBucket,
        });
        this.messageContainer.innerHTML =
          '<div class="success-message">Bucket switched successfully!</div>';
        this.pendingBucket = null;
        this.hideSwitchBucketConfirmation();
      });
    this.switchBucketModal
      .querySelector(".switch-confirm-no")
      .addEventListener("click", () => {
        this.bucketSelect.value = this.model.get("selected_bucket");
        this.pendingBucket = null;
        this.hideSwitchBucketConfirmation();
      });

    // Show messages from the Python backend, separating cases to prevent messages from overriding each other
    this.model.on("msg:custom", (content) => {
      const isCreatingBucket = this.flipCard.classList.contains("flipped");

      if (isCreatingBucket) {
        if (content.method === "bucket_creation_error") {
          this.messageContainer.innerHTML = `<div class="error-message">${content.message}</div>`;
        } else if (content.method === "bucket_creation_success") {
          this.messageContainer.innerHTML =
            '<div class="success-message">Bucket created successfully!</div>';
          this.model.send({ method: "refresh_buckets" });
        }
      } else {
        if (content.method === "bucket_refresh_success") {
          this.messageContainer.innerHTML =
            '<div class="success-message">Bucket list refreshed!</div>';
        } else if (content.method === "bucket_refresh_error") {
          this.messageContainer.innerHTML = `<div class="error-message">${content.message}</div>`;
        }
      }
    });

    this.model.on("change:s3_buckets", () => this.updateBucketList());
  }

  updateSelectedBucketText() {
    const bucket = this.model.get("selected_bucket");
    this.selectedBucketDisplay.textContent = `Selected Bucket: ${
      bucket ? bucket : "N/A"
    }`;
  }

  toggleDialog() {
    this.isDialogOpen = !this.isDialogOpen;
    this.dialog.style.display = this.isDialogOpen ? "flex" : "none";
    if (!this.isDialogOpen) {
      this.flipCard.classList.remove("flipped");
      this.messageContainer.innerHTML = "";
      this.newBucketInput.value = "";
    }
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.dialog.style.display = "none";
    this.flipCard.classList.remove("flipped");
    this.messageContainer.innerHTML = "";
    this.newBucketInput.value = "";
  }

  showConfirmation(bucketName) {
    this.confirmationModal.style.display = "flex";
    this.confirmationModal.querySelector(".bucket-name-confirm").textContent =
      bucketName;
  }

  hideConfirmation() {
    this.confirmationModal.style.display = "none";
  }

  showSwitchBucketConfirmation(newBucket) {
    this.switchBucketModal.style.display = "flex";
    this.switchBucketModal.querySelector(".new-bucket-name").textContent =
      newBucket;
  }

  hideSwitchBucketConfirmation() {
    this.switchBucketModal.style.display = "none";
  }

  updateBucketList() {
    this.bucketSelect.innerHTML = `
            <option value="">Choose existing bucket...</option>
            ${this.model
              .get("s3_buckets")
              .map((b) => `<option value="${b}">${b}</option>`)
              .join("")}
        `;
    this.bucketSelect.value = this.model.get("selected_bucket");
  }
}

// This is the actual uploader module
function render({ model, el }) {
  const container = document.createElement("div");
  container.className = "upload-container";

  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";

  const statusIcon = document.createElement("div");
  statusIcon.className = "status-icon";

  const text = document.createElement("div");
  text.className = "upload-text";
  text.innerHTML = `
        <span class="main-text title">Drag & Drop Files</span>
        <span class="sub-text">or click to browse</span>
    `;

  const fileList = document.createElement("div");
  fileList.className = "file-list";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  if (model.get("multiple")) fileInput.multiple = true;

  dropZone.appendChild(statusIcon);
  dropZone.appendChild(text);
  container.appendChild(dropZone);
  container.appendChild(fileList);
  container.appendChild(fileInput);
  el.appendChild(container);
  let isUploading = false;

  new S3DialogManager(container, model);

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Drag and drop event listeners
  for (const eventName of ["dragenter", "dragover"]) {
    dropZone.addEventListener(eventName, (e) => {
      preventDefaults(e);
      if (!isUploading) dropZone.classList.add("dragover");
    });
  }

  for (const eventName of ["dragleave", "drop"]) {
    dropZone.addEventListener(eventName, (e) => {
      preventDefaults(e);
      dropZone.classList.remove("dragover");
    });
  }

  // For cloud_only option, the user must select a bucket before uploading
  dropZone.addEventListener("click", () => {
    if (model.get("cloud_only") && !model.get("selected_bucket")) {
      alert("Please select a bucket before uploading files.");
      return;
    }
    fileInput.click();
  });

  dropZone.addEventListener("drop", (e) => {
    if (model.get("cloud_only") && !model.get("selected_bucket")) {
      alert("Please select a bucket before uploading files.");
      return;
    }
    handleFiles(e.dataTransfer.files);
  });

  // This is the function that actuall handles the upload of files
  // Updating the metadata, as well as the progress bar
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
    const newFiles = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: null,
      progress: 0,
      status: "uploading",
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
      await new Promise((resolve) => {
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            updateFileProgress(newFile.id, percent);
          }
        };
        reader.onloadend = (e) => {
          const content = e.target.result.split(",")[1];
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
    const files = model
      .get("files")
      .map((file) => (file.id === fileId ? { ...file, progress } : file));
    model.set("files", files);
    model.save_changes();
  }

  function completeFileUpload(fileId, content) {
    const files = model
      .get("files")
      .map((file) =>
        file.id === fileId
          ? { ...file, content, progress: 100, status: "complete" }
          : file
      );
    model.set("files", files);
    model.save_changes();
  }

  function checkAllUploadsComplete() {
    const allComplete = model
      .get("files")
      .every((f) => f.status === "complete");
    model.set("status", allComplete ? "complete" : "waiting");
    model.save_changes();
  }

  // This is the function that renders the file list (uploading, uploaded, and error)
  // as well as functionality for deletion
  function renderFileList() {
    fileList.innerHTML = "";
    for (const file of model.get("files")) {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
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
      const rightSection = document.createElement("div");
      rightSection.className = "file-right";
      const statusIcon = document.createElement("div");
      statusIcon.className = `file-status ${file.status}`;
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.onclick = () => {
        const confirmDelete = confirm(
          `Are you sure you want to delete "${file.name}"?`
        );
        if (confirmDelete) {
          const updatedFiles = model
            .get("files")
            .filter((f) => f.id !== file.id);
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
      if (model.get("s3_enabled") && model.get("selected_bucket")) {
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
    }
  }

  // Do the same as DropZone to prevent upload if no bucket chosen while cloud_only is true
  fileInput.addEventListener("change", (e) => {
    if (model.get("cloud_only") && !model.get("selected_bucket")) {
      alert("Please select a bucket before uploading files.");
      e.target.value = "";
      return;
    }
    handleFiles(e.target.files);
    e.target.value = "";
  });
  model.on("change:files", renderFileList);
  model.on("change:status", () => {
    statusIcon.className = `status-icon ${model.get("status")}`;
  });
  renderFileList();
}

export default { render };
