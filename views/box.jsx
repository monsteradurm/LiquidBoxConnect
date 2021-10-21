import React, { useState, useEffect, Fragment } from 'react';

// Atlaskit
import Button from '@atlaskit/button/standard-button';
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { FolderFilledIcon, DocumentFilledIcon } from '@atlaskit/icon/glyph/folder-filled';
import Spinner from '@atlaskit/spinner';

//other
import axios from 'axios';
import useFetch from 'react-fetch-hook';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { SpinnerDiamond } from 'spinners-react';
import EmptyState from '@atlaskit/empty-state';

import * as _ from 'underscore';

//css
import "./styles.css";

const BoxURL = "https://www.liquidanimation.live/box-rest"
const onRequestError = (err) => { 
  console.log("Request", err)
}

const FileItem = ({item, setDisplayItem}) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [base64String, setBase64String] = useState(null);

  useEffect(() => {
    if (item)
      axios({
          method: 'get',
          url: "https://liquidanimation.live/box-rest/thumbnail?id=" + item.id
          }).then((res) => {
            setThumbnail(res.data);
            if (res.data.file && res.data.file.data)
              setBase64String(btoa(String.fromCharCode(...new Uint8Array(res.data.file.data))));
        })
        .catch(err => onRequestError(err))
  }, [])
  
    return <div className="box-file-container bow-row">
              {
                base64String && 
                  <img src={`data:image/png;base64,${base64String}`} alt=""/>
                  
              }
              {
                thumbnail && thumbnail.location && 
                  <img src={thumbnail.location} /> 
              }
              <div className="box-file" onClick={() => setDisplayItem(item)}>{item.name}</div>
            </div>
}

const FolderItem = ({item, setCurrentFolderId, pageRoot}) => {
  return <div className="box-folder-container bow-row" onClick={() => {
            setCurrentFolderId(item.id);
          }}>
            <FontAwesomeIcon icon={faFolder} style={{fontSize: 25 + 'px', color: 'inherit'}}/>
            <div className="box-folder">{item.name}</div>
          </div>
}

const DisplayLoading = ({message}) => {
  return <div style={{width: '100%'}}>
              <div style={{margin: 'auto', width: 'fit-content', padding: 20 + 'px'}}>
                <Spinner size="xlarge" />
              </div>
              <div style={{margin: 'auto', width: 'fit-content'}}>
                <div style={{margin: 'auto'}}>
                  <EmptyState header={message} />
                </div>
              </div>
            </div>  
}

const DisplayError = ({message}) => {
  return <div style={{width: '100%'}}>
              <div style={{margin: 'auto', width: 'fit-content'}}>
                <div style={{margin: 'auto'}}>
                  <EmptyState header={message} />
                </div>
              </div>
            </div>  
}

const NavigationCrumbs = ({setCurrentFolderId, boxCrumbs}) => {
  return <Breadcrumbs>
            {
                boxCrumbs.map(crumb => (<BreadcrumbsItem key={crumb.id + '_crumb'} 
                text={crumb.name} 
                onClick={() => setCurrentFolderId(crumb.id)}/>)   
                )
            }  
        </Breadcrumbs>
}

export default function box() {
  const [properties, setProperties] = useState({ title: null, spaceKey: null});
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [boxCrumbs, setBoxCrumbs] = useState([]);
  const [boxRoot, setBoxRoot] = useState(null);
  const [pageRoot, setPageRoot] = useState(null);

  const [page, setPage] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [displayItem, setDisplayItem] = useState(null)

    useEffect(() => {
      if (displayItem && displayItem.shared_link && displayItem.shared_link.url) {
        window.open(displayItem.shared_link.url, "_blank");
      } else if (displayItem) {
        axios({
          method: 'get',
          url: "https://liquidanimation.live/box-rest/sharedFile?id=" + displayItem.id
          }).then((res) => {
            window.open(res.data.shared_link.url, "_blank");
        })
        .catch(err => onRequestError(err))
      }
    },[displayItem])
  

   useEffect(() => {
    setPage(props.title);
    setProjectId(props.spaceKey);

    AP.request({
      url: '/rest/api/space/' + props.spaceKey + '/property/forge-BoxRoot',
      success: (res) => { 
        const result = JSON.parse(res);
        setBoxRoot(result.value);
        axios({
            method: 'get',
            url: "https://liquidanimation.live/box-rest/folderItems?root=" + result.value
            }).then((res) => {
              const root = _.find(res.data.entries, (e) => e.name == props.title);
              if (!root) {
                setErrorMsg("Box Folder: " + '"' + props.title + '"' + " could not be found!");
              } else {
                setPageRoot(root.id);
                setCurrentFolderId(root.id);
              }
          })
          .catch(err => onRequestError(err))
      },
      error: onRequestError 
    });
  }, []);
  
  useEffect(() => {
    if (currentFolderId)
     axios({
        method: 'get',
        url: "https://liquidanimation.live/box-rest/folderInfo?id=" + currentFolderId
        }).then((res) => {

            if (!pageRoot || currentFolderId == pageRoot) {
              console.log("Root Directory");
              setBoxCrumbs([{id: res.data.id, name: res.data.name}]);
            }

            const entries = res.data.path_collection.entries;
            const crumbIndex = _.findIndex(entries, (c) => c.id == pageRoot);
            if (crumbIndex < 0)
              setBoxCrumbs([{id: res.data.id, name: res.data.name}]);
            else {
              const crumbs = [...[...entries].splice(crumbIndex), {id:res.data.id, name:res.data.name}];
              setBoxCrumbs(crumbs);
              console.log(entries, crumbIndex, crumbs);
            }

        })
      .catch(err => onRequestError(err))
  }, [currentFolderId]);

  useEffect(() => {
    if (currentFolderId) {
      setFetching(true);

      axios({
        method: 'get',
        url: "https://liquidanimation.live/box-rest/folderItems?root=" + currentFolderId
        }).then((res) => {
          
          const folderEntries = []
          _.forEach(res.data.entries.filter(item => item.type == 'folder'), (folder) => {
            const rootIndex = _.findIndex(folder.path_collection.entries, (f) => f.id == boxRoot);
            folder['crumbs'] = [...folder.path_collection.entries.splice(rootIndex + 1), {id: folder.id, name: folder.name}];
            folderEntries.push(folder);
          });

          setFolders(folderEntries);
          setFiles(res.data.entries.filter(item => item.type == 'file'));
          setFetching(false);
      })
      .catch(err => onRequestError(err))
    }
  }, [currentFolderId]);
  
  if (errorMsg)
    return <DisplayError message={errorMsg} />

  else if (fetching && !pageRoot) 
    return <DisplayLoading message="Connecting to Box..." />

  return <Fragment> 
                <NavigationCrumbs setCurrentFolderId={setCurrentFolderId} 
                                page={page}
                                boxCrumbs={boxCrumbs} 
                                pageRoot={pageRoot} />
                {
                  fetching &&
                    <DisplayLoading message="Fetching Box Data..."/>
                }
                {
                  !fetching &&
                      folders.map(item => (<FolderItem key={item.id + '_folder'}
                      item={item} 
                      setCurrentFolderId={setCurrentFolderId}
                      />))
                }
                { 
                  !fetching &&
                      files.map(item => (<FileItem key={item.id + '_file'}
                      item={item}
                      setDisplayItem={setDisplayItem}
                      />))
                }
            </Fragment>;
}
