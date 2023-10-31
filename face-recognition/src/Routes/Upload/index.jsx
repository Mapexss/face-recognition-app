import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import { client, generateUuid, deleteWhere, createSchema, deleteSchema } from '../../weaviateConfigs'; 
import { Buffer } from 'buffer';

const Card = styled.div`
    display: flex;
    width: 500px;
    height: 300px;
    margin: 10;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(87, 87, 87, 0.2);
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
`;

const FileUpload = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    gap: 10px;
`;

const SubmitButton = styled.div`
    margin-bottom: 10px;
    width: 100%;
`;

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [studentName, setStudentName] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (!selectedFile) {
            setPreview('');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    }, [selectedFile]);

    const handeStudentNameChange = event => {
        setStudentName(event.target.value);
    }
    const handleDelete = event => {
        // createSchema();
        // deleteSchema();
        //deleteWhere(studentName);
    }

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };
  
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('Selecione um arquivo!');
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            const b64 = Buffer.from(reader.result).toString('base64');
            
            const res = await client.data.creator()
            .withClassName('Face')
            .withProperties({
                studentId: generateUuid(),
                image: b64, 
                name: studentName, 
                registrationId: '123'
            })
            .do();
            console.log(res);
        };
        reader.readAsDataURL(selectedFile);
    };

    return (
        <>
            <h1>File Upload</h1>
            <FileUpload>
                <Card>
                    {preview && <img style={{maxWidth: 200, maxHeigth: 600}} id="previewImg" src={preview} alt="Preview" />}
                    <input type="file" onChange={handleFileChange} />
                    <input onChange={handeStudentNameChange} />
                </Card>
                <SubmitButton style={{textAlign: "center", width: "80%"}}>
                    <input value="Submit" type='button' id="submit" className="submit" onClick={handleFileUpload} />
                </SubmitButton>
                <SubmitButton style={{textAlign: "center", width: "80%"}}>
                    <input value="Deletar" type='button' id="submit" className="submit" onClick={handleDelete} />
                </SubmitButton>
            </FileUpload>
        </>
    );
}

export default App;