import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Layout from "../../components/layout/Layout";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";

const Upload = () => {
  const [type, setType] = useState(null);
  const [isImgPicked, setIsImgPicked] = useState(false);
  const [isMediaPicked, setIsMediaPicked] = useState(false);
  const [img, setImg] = useState({ file: null });
  const [media, setMedia] = useState({ file: null, loaded: 0 });
  const [uploadState, setUploadState] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);

  const handleUpload = () => {
    if (!isImgPicked && !isMediaPicked) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select an image and a media file",
      });
    }

    Swal.showLoading();

    const imgref = ref(storage, `images/` +  Date.now() + img.file.name);
    const mediaref = ref(storage, `media/` + Date.now() + media.file.name);
    
    uploadBytes(imgref, img.file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImgUrl(url);
          console.log(url)
          Swal.hideLoading()
          setUploadState(true)
        });
    })

    uploadBytes(mediaref, media.file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setMediaUrl(url);
        console.log(url)
      })
    })

  };

  const handleSubmit = () => {
    if (!title || !description || !tags) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the fields",
      });
    }

    Swal.showLoading();

    axios
      .post(
        "/upload/add_content",
        {
          title,
          description,
          tags,
          imgUrl,
          mediaUrl,
          isPrivate,
          type,
        },
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      )
      .then((res) => {
        Swal.hideLoading()
        console.log(res);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your video has been uploaded",
        });
        window.location.reload();
      })
      .catch((err) => {
        Swal.hideLoading()
        console.log(err);
      });
  };

  const handleImgChange = (e) => {
    setImg({ file: e.target.files[0] });
    setIsImgPicked(true); // update imgPicked state
  };

  const handleMediaChange = (e) => {
    if (e.target.files[0].type.includes("video")) {
      setType("video");
    } else if (e.target.files[0].type.includes("audio")) {
      setType("audio");
    } else {
      Swal.fire({
        icon: "error",
        text: "Please select a Audio or Video file Only!",
      });
      e.target.value = null;
      return;
    }
    setMedia({ file: e.target.files[0], loaded: 0 });
    setIsMediaPicked(true);
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 my-2">
            <div className="mb-3">
              <label htmlFor="thumbfile" className="form-label">
                Thumbnail
              </label>
              <input
                className="form-control"
                type="file"
                id="thumbfile"
                onChange={handleImgChange}
                accept="image/*"
                disabled={uploadState}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 my-2">
            <div className="mb-3">
              <label htmlFor="mediafile" className="form-label">
                Media
              </label>
              <input
                className="form-control"
                type="file"
                id="mediafile"
                onChange={handleMediaChange}
                accept="video/*, audio/*"
                disabled={uploadState}
              />
            </div>
          </div>

          {!uploadState ? (
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-danger"
                onClick={handleUpload}
                disabled={!(isImgPicked && isMediaPicked)}
                style={{ maxWidth: "150px" }}
              >
                Upload Files
              </button>
            </div>
          ) : (
            <>
              <div className="col-12 col-md-6 my-2">
                <input
                  className="form-control"
                  type={"text"}
                  placeholder="Title.."
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 my-2">
                <input
                  className="form-control"
                  type={"text"}
                  placeholder="Enter comma seperated Tags"
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 my-2">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-6 my-2">
                {/* public, private */}
                <input
                  className="m-2"
                  type={"radio"}
                  name="type"
                  id="public"
                  checked
                />
                <label htmlFor="public">Public</label>
                <br />
                <input
                  className="m-2"
                  type={"radio"}
                  name="type"
                  id="private"
                />
                <label htmlFor="private">Private</label>
              </div>
              <div className="col-12 col-md-6 my-2"></div>
              <div className="col-12 col-md-6 my-2">
                <a className="btn btn-primary" onClick={handleSubmit} disabled={!(imgUrl && mediaUrl)}>
                  Submit
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
