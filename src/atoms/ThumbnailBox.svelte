<script>
    import {fetchPut} from "$lib/Fetcher";
  
    export let thumbnailUrl = ''
    export let filename = ''
  
    let shuffling = false
    let changedThumbnailUrl = thumbnailUrl
  
    const shuffleThumbnail = async () => {
        shuffling = true
        try {
            await fetchPut(`/videos/${filename}/thumbnail`, {})
        } catch (e) {
            alert(`failed to shuffle thumbnail.\n${e}`)
        }
        changedThumbnailUrl = thumbnailUrl + '?' + new Date().getTime()
        shuffling = false
    }
  </script>
  
  
<div class="card">
    <img src={changedThumbnailUrl} class="card-img-top w-4/5 sm:w-[390px] sm:h-[220px]" alt="...">
    <div class="card-body flex justify-center">
        <button class="btn btn-outline-dark {shuffling ? 'disabled' : ''}" on:click={shuffleThumbnail}>Shuffle!</button>
    </div>
</div>