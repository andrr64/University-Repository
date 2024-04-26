import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreatingListing() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address : '',
        type: '',
        bedRooms: 1,
        bathRooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(null);   
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const {currentUser} = useSelector((state) => state.user);

    const handleImageSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setUploading(true);
        setImageUploadError(false);
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            for (const file of files) { // Use `of` for iteration
                promises.push(storageImage(file));
            }
            try {
                const imageUrls = await Promise.all(promises); // Wait for all uploads to finish
                setFormData({ 
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(imageUrls) 
                });   
                setImageUploadError(false);
            } catch (error) {
                setImageUploadError(error);
            }
        } else {
            setImageUploadError('You can only upload 6 images per listing');
        }
        setUploading(false);
    };
    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }
    }
    const handleDeleteImage = (urlToDelete) => {
        // Filter imageUrls array to remove the image with the given URL
        const updatedImageUrls = formData.imageUrls.filter(url => url !== urlToDelete);
        // Update formData state with the updated imageUrls
        setFormData(prevFormData => ({
            ...prevFormData,
            imageUrls: updatedImageUrls
        }));
    }
    const renderImages = () => {
        return formData.imageUrls.map((url, index) => (
            <div 
                key={index} 
                className="flex justify-between p-3 border items-center font-semibold"
            >
                <img className="w-20 h-20 object-contain rounded-lg" src={url} alt="listing image"/>
                <button 
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95" 
                    type="button" 
                    onClick={() => handleDeleteImage(url)}
                >
                    Delete
                </button>
            </div>
        ));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length === 0) return setError('You must upload at least one image');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            })
            const resJson = await res.json();
            setLoading(false);
            if (resJson.success === false){
                setError(resJson.message);
            }
            navigate(`/listing/${resJson._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    const storageImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log((snapshot.bytesTransferred/snapshot.totalBytes)*100);
          },
          (error) => {
            reject(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
            });
          }
        );
      });
    };
    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input 
                        type="text" 
                        placeholder='Name' 
                        className='border rounded-lg p-3'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <input 
                        type="text" 
                        placeholder='Address' 
                        className='border rounded-lg p-3'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <input 
                        type="text" 
                        placeholder='Description' 
                        className='border rounded-lg p-3'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="sale" 
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="rent" 
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking}/>
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}/>
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5"onChange={handleChange} checked={formData.offer}/>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input 
                                className="p-3 border border-gray-300 rounded-lg" 
                                type="number" 
                                placeholder= '' 
                                id="bedRooms" 
                                min='1' 
                                max='10' 
                                onChange={handleChange}
                                value={formData.bedrooms}
                                required
                            />
                            <div>
                                <p>Beds</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                className="p-3 border border-gray-300 rounded-lg" 
                                type="number" 
                                placeholder= '' 
                                id="bathRooms" 
                                min='1' 
                                max='10' 
                                required
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <div>
                                <p>Baths</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                className="p-3 border border-gray-300 rounded-lg" 
                                type="number" 
                                placeholder= '' 
                                id="regularPrice" 
                                min='50' 
                                max='1000000' 
                                onChange={handleChange}
                                value={formData.regularPrice}
                                required
                            />
                            <div>
                                <p>Regular price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                className="p-3 border border-gray-300 rounded-lg" 
                                type="number" 
                                placeholder= '' 
                                id="discountPrice" 
                                min='50' 
                                max='1000000' 
                                onChange={handleChange}
                                value={formData.discountPrice}
                                required
                            />
                            <div>
                                <p>Discounted price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input 
                        onChange={(e) => setFiles(e.target.files)}
                        className="p-3 border border-gray-300 rounded w-full" 
                        type="file" 
                        id="images" 
                        accept="image/*" 
                        multiple
                        />
                        <button
                        disabled={uploading}
                        type="button" 
                        onClick={handleImageSubmit}
                        className="p-3 text-green-700 border border-green-700 disabled:opacity-70">
                            {uploading? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 && renderImages()}
                    <button 
                    className="rounded-lg uppercase  p-3 bg-slate-700 text-white hover:opacity-95 disabled:opacity-80"
                    onClick={handleSubmit}
                    disabled={loading}
                    >
                        {loading? 'Creating Listing...' : 'Creating Listing'}
                    </button>
                </div>
            </form>
        </main>
    )
}
