<script>
    import {fetchPut} from "$lib/Fetcher"

    export let filename = ''

    const id = 'editTagModal';
    let input = ''
    const editTag = async () => {
        const tags = input.split(',').map(tag => tag.trim())
        const res = await fetchPut(`/videos/${filename}/tags`, { tags })

        location.href = `/#/view/${res.filename}`
        location.reload()
    }
</script>

<div class="modal fade" id={id} tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalLabel">Edit tags</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">#</span>
                    </div>
                    <input type="text" class="form-control" bind:value={input} placeholder="tags separated by ," aria-label="Username" aria-describedby="basic-addon1">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" on:click={editTag} data-bs-dismiss="modal">Confirm</button>
            </div>
        </div>
    </div>
</div>
