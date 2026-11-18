# On-device OMR notices

Piano Kingdom bundles the photo-recognition worker, WebAssembly reader, and
reader source from [Partsong](https://github.com/pzfreo/partsong), pinned to
commit `9834842408b3012730b76249e0c3738820a08912`. Partsong is distributed under
AGPL-3.0. Its license and matching reader source are available at that pinned public
repository. The reader uses
`homr-rs` pinned to commit `f6309104e3582bae8df22669f0325e7fd1a7ab32`; the
corresponding source is available from
https://github.com/pzfreo/homr-rs/tree/f6309104e3582bae8df22669f0325e7fd1a7ab32.

The reader's homr model weights are fetched during the GitHub Pages build from
the homr `onnx_checkpoints` release and served by this app. They total
157,528,486 bytes. The upstream project notes that part of the model training
data (Camera-PrIMuS) is licensed for non-commercial use. Piano Kingdom is a
free, non-commercial family learning app.

The ONNX Runtime Web files are pinned by SHA-256 in Partsong's
`scripts/fetch-libs.sh` and copied into the deployed app. Runtime
recognition runs in the browser on the user's device. Sheet photos are not sent
to a server. The deployed app's source is available at
https://github.com/chinkk-git/aaria-magical-piano-kingdom.
