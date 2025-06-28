<script>
    import {fetchPost, fetchGet} from "$lib/Fetcher";
    import UploadModal from "../atoms/UploadModal.svelte";
	import '../app.css'
    import { onMount } from 'svelte'

	let {children} = $props()
    let uploadProgress = 0

    const fileUpload = () => {
        const files = document.getElementById('fileInput').files
        return async (filename) => {
            if (files.length > 0) {
                const formData = new FormData()
                formData.append('file', files[0])
                try {
                    const response = await fetch("/video", { // url을 직접 지정
                        method: 'POST',
                        body: formData, // FormData 객체는 자동으로 'Content-Type: multipart/form-data'를 설정합니다.
                        headers: {
                            // "Content-Type": "multipart/form-data", // fetch는 body가 FormData일 때 자동으로 설정
                            'filename': encodeURIComponent(filename) // 커스텀 헤더
                        },
                    });

                    if (!response.ok) { // HTTP 상태 코드가 200번대가 아니면 오류
                        const errorData = await response.json().catch(() => ({ message: response.statusText }));
                        throw new Error(`업로드 실패: ${response.status} ${errorData.message}`);
                    }

                    const result = await response.json(); // 서버 응답 파싱

                    if (result.success) {
                        uploadMessage = `파일 업로드 성공: ${selectedFile.name}`;
                        // invalidateAll(); // 필요하다면 SvelteKit의 데이터 무효화
                    } else {
                        uploadMessage = `파일 업로드 실패: ${result.message || '알 수 없는 오류'}`;
                    }
                } catch (e) {
                    console.error(`파일 업로드 오류:`, e);
                    uploadMessage = `파일 업로드 오류:\n${e.message || e}`;
                } finally {
                    isLoading = false;
                    selectedFile = null;
                    if (document) (document.getElementById('fileInput')).value = '';
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
    
    let downloading = $state({})
    onMount(() => {
        setInterval(async () => {
            downloading = await fetchGet('/info/downloading')
        }, 1000)
    })
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
			<UploadModal modalId="uploadFileModal" modalTitle="Upload from file" fileUploadProgress={uploadProgress} clickHandler={fileUpload}>
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
	
    <div class="flex flex-col gap-y-1 items-center justify-center">
        {#each Object.entries(downloading) as [name, progress]}
            <div>Downloading {name}... {progress.toFixed(2)}%</div>
        {/each}
    </div>
	{@render children()}	
</div>
