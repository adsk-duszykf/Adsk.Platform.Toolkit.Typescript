import { BaseAutodeskDataManagement } from './GeneratedCode/DataMgt/baseAutodeskDataManagement';
import { V1RequestBuilder } from './GeneratedCode/DataMgt/data/v1';
import { BaseAutodeskOSSClient } from './GeneratedCode/OSS/baseAutodeskOSSClient';
import { V2RequestBuilder } from './GeneratedCode/OSS/oss/v2';
import { FileVersionNode, FolderNode, HubNode, ProjectNode } from './Models/node';
export class DataManagementClientHelper {

    private readonly _dataMgtApi: V1RequestBuilder;
    private readonly _ossApi: V2RequestBuilder;
    constructor(private dataMgtClient: BaseAutodeskDataManagement, ossClient: BaseAutodeskOSSClient) {
        this._dataMgtApi = dataMgtClient.data.v1;
        this._ossApi = ossClient.oss.v2;
    }

    /**
     * Get the list of ACC/BIM360 hubs
     *
     * @return {Promise<HubNode[]>} List of hubs
     * @memberof DataManagementClientHelper
     */
    async getHubs(): Promise<HubNode[]> {
        const hubs = await this.dataMgtClient.project.v1.hubs.get({ queryParameters: { filterextensionType: ["hubs:autodesk.bim360:Account"] } });
        return hubs?.data
            ?.map<HubNode>(x => ({ name: x.attributes?.name || "", id: x.id || "", type: 'hub' }))
            .sort((a, b) => a.name.localeCompare(b.name))
            || [];
    }

    /**
     * Get the list of projects for a given hub
     *
     * @param {string} hubId Hub ID.
     * @return {Promise<ProjectNode[]>} List of projects
     * @memberof DataManagementClientHelper
     */
    async getProjects(hubId: string): Promise<ProjectNode[]> {
        const projects = await this.dataMgtClient.project.v1.hubs.byHub_id(hubId).projects.get();
        return projects?.data
            ?.map<ProjectNode>(x => ({
                name: x.attributes?.name || "",
                id: x.id || "",
                type: 'project',
                hubId
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            || [];

    }

    /**
     * Get the list of folders for a given project and folder
     *
     * @param {string} hubId Hub Id
     * @param {string} projectId Project Id. The method fix the ID if needed (adding the "b." prefix)
     * @param {string} [fromFolderId] Optional. If not provided, the method returns the top folders of the project. Otherwise, it returns the subfolders of the given folder.
     * @return {Promise<FolderNode[]>} List of folders
     * @memberof DataManagementClientHelper
     */
    async getFolders(hubId: string, projectId: string, fromFolderId?: string): Promise<FolderNode[]> {

        projectId = this.fixProjectId(projectId);

        if (fromFolderId) {
            return this.getSubFolders(projectId, fromFolderId);
        }

        return this.getTopFolders(hubId, projectId);
    }

    /**
     * Get the list of folders for a given project
     *
     * @param {string} hubId Hub Id
     * @param {string} projectId Project Id. The method fix the ID if needed (adding the "b." prefix)
     * @return {Promise<FolderNode[]>} List of folders
     * @memberof DataManagementClientHelper
     */
    async getTopFolders(hubId: string, projectId: string): Promise<FolderNode[]> {
        
        projectId = this.fixProjectId(projectId);

        const folders = await this.dataMgtClient.project.v1.hubs.byHub_id(hubId).projects.byProject_id(projectId).topFolders.get();
        
        return folders?.data
            ?.map<FolderNode>(x => ({
                name: x.attributes?.displayName || "",
                id: x.id || "",
                type: 'folder',
                parentFolderId: undefined,
                projectId
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            || [];
    }

    /**
     * Get the list of folders for a given folder
     *
     * @param {string} projectId Project Id. The method fix the ID if needed (adding the "b." prefix)
     * @param {string} fromFolderId Parent folder Id
     * @return {Promise<FolderNode[]>} List of folders
     * @memberof DataManagementClientHelper
     */
    async getSubFolders(projectId: string, fromFolderId: string): Promise<FolderNode[]> {

        projectId = this.fixProjectId(projectId);

        const folders = await this.dataMgtClient.data.v1.projects
            .byProject_id(projectId).folders
            .byFolder_id(fromFolderId)
            .contents.get({ queryParameters: { filtertype: ['folders'] } });
        
        return folders?.data
            ?.map<FolderNode>(x => ({
                name: x.attributes?.displayName || "",
                id: x.id || "",
                type: 'folder',
                parentFolderId: fromFolderId,
                projectId
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            || [];
    }

    /**
     * Get the list of files for a given folder
     *
     * @param {string} projectId Project Id. The method fix the ID if needed (adding the "b." prefix)
     * @param {string} fromFolderId Parent folder Id
     * @return {Promise<FolderNFileVersionNodeode[]>} List of files
     * @memberof DataManagementClientHelper
     */
    async getLatestFileVersions(projectId: string, fromFolderId: string): Promise<FileVersionNode[]> {
        
        const files = await this.dataMgtClient.data.v1.projects
            .byProject_id(projectId).folders
            .byFolder_id(fromFolderId)
            .contents.get(
                {
                    queryParameters: {
                        filtertype: ['items'],
                        filterextensionType: ["items:autodesk.bim360:File"]
                    }
                });
        
        return files?.data
            ?.map<FileVersionNode>(x => ({
                name: x.attributes?.displayName || "",
                id: x.id || "",
                type: 'fileVersion',
                parentFolderId: fromFolderId,
                projectId
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
            || [];
    }


    fixProjectId(projectId: string) {
        return projectId.toLowerCase().startsWith("b.") ? projectId : `b.${projectId}`;
    }
}