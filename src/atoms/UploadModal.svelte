<script lang="ts">
    export let modalId = '1'
    export let modalTitle = 'Upload new video'
    export let fileUploadProgress = 0
    export let clickHandler = async (filename: string) => {
        alert('empty handler' + filename)
    }

    let tags: string[] = []
    let uploading = false

    const onClickWrapper = async () => {
        const title = document.getElementById(`titleInput-${modalId}`).value
        if (!title) {
            // alert no title
            alert('no title')
            return
        }

        const filename = `${tags.join('-')}-${title}.mp4`
        uploading = true
        await clickHandler()(filename)
        uploading = false
        location.href = '/view/' + filename
    }

    const addTag = () => {
        const tagInput = document.getElementById(`tagInput-${modalId}`).value.replace('-', '')
        document.getElementById(`tagInput-${modalId}`).value = ''
        if (tagInput === '' || tags.includes(tagInput)) {
            return
        }

        tags.push(tagInput)
        tags = tags // rerender
    }

    const tagInputKeyPress = (e) => {
        if (e.code === 'Enter') addTag()
    }
</script>

<div class="modal fade" id={modalId} tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalLabel">{modalTitle}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <slot></slot>
            <div class="flex gap-y-2 flex-col">
                <label for="titleInput-{modalId}" class="form-label text-2xl">Video Info</label>
                <input id="titleInput-{modalId}" type="text" class="form-control" placeholder="Title" aria-label="Title">
                <div id="tags" class="flex gap-x-2">
                    {#each tags as tag}
                        <div>{tag}</div>
                    {/each}
                </div>
                <div class="flex gap-x-1 h-[38px]">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="tagInputBoxLabel">#</span>
                        <input id="tagInput-{modalId}" type="text" class="form-control" placeholder="Tag" aria-label="Tag" aria-describedby="tagInputBoxLabel" on:keypress={tagInputKeyPress}>
                    </div>
                    <button class="btn btn-dark" on:click={addTag}>Add</button>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            {#if uploading}
                <div class="p-2 w-full">
                    <div class="progress" role="progressbar" aria-label="Uploading progress"
                        aria-valuenow="{Math.floor(fileUploadProgress)}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: {Math.floor(fileUploadProgress)}%">
                            {(fileUploadProgress).toFixed(2)}%
                        </div>
                    </div>
                </div>
            {/if}
            <button type="button" class="btn btn-secondary {uploading ? 'disabled' : ''}" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary {uploading || fileUploadProgress === 100 ? 'disabled' : ''}" on:click={onClickWrapper}>
                {fileUploadProgress === 100 ? 'Done' : 'Start upload'}
            </button>
        </div>
        </div>
    </div>
</div>