<script lang="ts">
    import {fetchGet} from "$lib/Fetcher";
    import type { DiskSpace } from "check-disk-space";
    import {onMount} from "svelte";


    export let diskInfo: DiskSpace
    export let diskRemainText = ''

    let free = 0
    let size = 0
    let remaining = 0

    onMount(async () => {
        free = diskInfo.free / 1024 / 1024 / 1024
        size = diskInfo.size / 1024 / 1024 / 1024

        remaining = ((size - free)/size)
        diskRemainText = `${(size - free).toFixed(2)} GB / ${size.toFixed(2)} GB`
    })
</script>

<div class="p-2 w-full">
    <div class="progress" role="progressbar" aria-label="Disk Space Remaining"
         aria-valuenow="{Math.floor(remaining*100)}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" style="width: {Math.floor(remaining*100)}%">
            {(remaining*100).toFixed(2)}%
        </div>
    </div>
</div>
