<script>
    import {fetchPost} from "$lib/Fetcher";
    import UploadModal from "../atoms/UploadModal.svelte";
    import axios from "axios";
	import '../app.css'

	let {children} = $props()
    let uploadProgress = 0

    const fileUpload = (files) => {
        return async (filename) => {
            if (files.length > 0) {
                const formData = new FormData()
                formData.append('file', files[0])
                try {
                    await axios.request({
                        method: 'POST',
                        url: "/video", 
                        data: formData,
                        headers: {
                            "content-type": "multipart/form-data",
                            'filename': encodeURIComponent(filename)
                        },
                        onUploadProgress: (p) => {
                            uploadProgress = (p.loaded / p.total)*100
                        }
                    })
                } catch (e) {
                    alert(`Upload Error\n${e}`)
                }
            }
        }
    }

    const urlUpload = (videoUrl) => {
        return async (filename) => {
            if (videoUrl) {
                try {
                    await fetchPost(`/video/from-url`, { url: videoUrl, filename })
                } catch (e) {
                    alert(`Upload Error\n${e}`)
                }
            } else {
                // no url alert
                alert('no url')
            }
        }
    }
</script>

<div class="w-screen h-screen flex flex-col">
	<header class="flex justify-between items-center py-2 px-6 border-b bg-slate-100 border-gray-300">
		<a href="/" class="no-underline" onclick={() => location.href='/'}>
			<div class="flex gap-x-2 items-center">
				<img src="/icon.png" alt="logo" width="60" />
				<span class="text-2xl font-bold text-black">SelfStream</span>
			</div>
		</a>
		<div class="items-center justify-between space-x-4 hidden md:flex">
			<div class="dropdown">
				<span class="btn btn-dark dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					Upload
				</span>
				<ul class="dropdown-menu">
					<li class="dropdown-item hover:cursor-pointer" data-bs-toggle="modal" data-bs-target="#uploadFileModal">From File</li>
					<li class="dropdown-item hover:cursor-pointer" data-bs-toggle="modal" data-bs-target="#uploadUrlModal">From Url</li>
				</ul>
			</div>
			<UploadModal modalId="uploadFileModal" modalTitle="Upload from file" fileUploadProgress={uploadProgress} clickHandler={() => fileUpload(document.getElementById('fileInput').files)}>
				<div class="mb-3">
                    <form method="post" enctype="multipart/form-data">
					    <input class="form-control" type="file" id="fileInput" accept="video/mp4">
                    </form>
				</div>
			</UploadModal>
			<UploadModal modalId="uploadUrlModal" modalTitle="Upload from url" clickHandler={() => urlUpload(document.getElementById('urlInput').value)}>
				<div class="mb-3">
					<div class="input-group mb-3">
						<span class="input-group-text" id="Upload from url">Video URL</span>
						<input id="urlInput" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="Upload from url">
					</div>
				</div>
			</UploadModal>
		</div>
	</header>
	
	{@render children()}	
</div>
