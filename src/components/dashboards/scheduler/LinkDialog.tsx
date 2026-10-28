import React from 'react';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../ui/dialog";
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Loader2, Clock, Link as LinkIcon } from 'lucide-react';
import { PlatformKey } from './types';
import { PLATFORMS } from './icons';

interface LinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    linkDialog: any;
    linkUrl: string;
    setLinkUrl: (url: string) => void;
    linkPostedAt: string;
    setLinkPostedAt: (date: string) => void;
    submittingLink: boolean;
    onSave: () => void;
}

export function LinkDialog({
    open,
    onOpenChange,
    linkDialog,
    linkUrl,
    setLinkUrl,
    linkPostedAt,
    setLinkPostedAt,
    submittingLink,
    onSave
}: LinkDialogProps) {
    const platformName = linkDialog?.platform ? linkDialog.platform.charAt(0).toUpperCase() + linkDialog.platform.slice(1) : '';
    const platformKey = linkDialog?.platform as PlatformKey | undefined;
    const platform = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey] : null;
    const Icon = platform?.icon;
    const isEdit = linkDialog?.mode === 'edit';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5">
                        {Icon && (
                            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                        )}
                        <div>
                            <div className="text-lg font-semibold">
                                {isEdit ? 'Edit' : 'Add'} {platformName} Link
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {isEdit 
                            ? 'Update the URL for this post'
                            : 'Paste the URL of the published post'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Post URL Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <LinkIcon className="h-4 w-4 text-gray-600" />
                            Post URL
                        </label>
                        <Input
                            placeholder="https://..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            disabled={submittingLink}
                            className="text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-black"
                            autoFocus
                        />
                        <p className="text-xs text-gray-500">Enter the full URL of the published post</p>
                    </div>

                    {/* Posted/Scheduled Time Input */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <Clock className="h-4 w-4 text-gray-600" />
                            Posted / Scheduled Time
                        </label>
                        <Input
                            type="datetime-local"
                            value={linkPostedAt}
                            onChange={(e) => setLinkPostedAt(e.target.value)}
                            disabled={submittingLink}
                            className="text-sm focus:ring-2 focus:ring-black"
                        />
                        <p className="text-xs text-gray-500">Leave empty to use the current time</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)} 
                            disabled={submittingLink}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={onSave} 
                            disabled={submittingLink || !linkUrl}
                            className="bg-black text-white hover:bg-gray-900 cursor-pointer font-semibold"
                        >
                            {submittingLink ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Link"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
