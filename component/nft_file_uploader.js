import { FileUploader } from "react-drag-drop-files";
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import { BarLoader } from "react-spinners";
import { useState } from "react";
import { css } from "@emotion/react";

const NFTFileUploader = ({ onFileChange, loading }) => {
    const override = css`
  display: block;
  margin: 0 auto;
  background : #909090;
`;
    const fileTypes = ["JPG", "PNG", "GIF"];
    const styles = {
        dropContainer: {
            height: '200px',
            width: '400px',
            background: '#F0F0F0',
            borderRadius: '4px',
            borderStyle: 'dashed',
            borderColor: '#C8C8C8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
        },
        icon: {
            height: 40,
            width: 40,
            color: '#909090'
        },
        itemText: {
            color: '#909090',
            marginBottom: '12px',
        }
    };

    return (
        <>
            <FileUploader
                handleChange={onFileChange}
                name='file'
                types={fileTypes} children={
                    <div style={styles.dropContainer}>
                        {
                            loading ? (<>
                                <div style={styles.itemText}>
                                    Uploading...
                                </div>
                                <BarLoader color={"#F0F0F0"} loading={true} size={150} css={override} />
                            </>
                            ) :
                                (<>
                                    <MoveToInboxIcon sx={styles.icon} />
                                    <div style={styles.itemText}>
                                        Drag your item here or tap on this box
                                    </div>
                                </>
                                )
                        }
                    </div>
                } />

        </>
    );
}

export default NFTFileUploader;