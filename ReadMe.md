# Reorient

A web tool for reorienting and cropping MRI data.

## Description

Reorient is a web-based tool for reorienting and cropping MRI data. It allows users to:

- Load NIFTI files (.nii or .nii.gz)
- Rotate and translate MRI volumes
- Select a region of interest for cropping
- Save the transformed MRI data

## Installation

1. Clone the repository:
```bash
git clone https://github.com/neuroanatomy/reorient.git
cd reorient
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Use the interface to:
   - Load a NIFTI file
   - Use the Translate, Rotate, and Select tools to manipulate the MRI data
   - Save the transformed data

## Features

- **Translate Tool**: Move the MRI volume in any direction
- **Rotate Tool**: Rotate the MRI volume around any axis
- **Select Tool**: Define a region of interest for cropping
- **Save/Load Matrix**: Save or load transformation matrices
- **Save/Load Selection**: Save or load selection boxes
- **Save NIFTI**: Save the transformed and cropped MRI data

## Citation

Katja Heuer and Roberto Toro (2020). Reorient: A Web tool for reorienting and cropping MRI data. Journal of Open Source Software, 5(53), 2670. [https://doi.org/10.21105/joss.02670](https://doi.org/10.21105/joss.02670).

## License

ISC License
