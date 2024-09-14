import { useActiveUser, useNewEvent } from 'nostr-hooks';

import {
  useActiveGroup,
  useGlobalNdk,
  useGroup,
  useGroupAdmin,
  useGroupAdmins,
  useGroupMembers, useLoginModalState, useNip29Ndk,
} from '@/shared/hooks';
import { deleteGroup } from '@/features/groups/shared/hooks';
import { useToast } from '@/shared/components/ui/use-toast.ts';

export const useGroupDetails = ({ groupId }: { groupId: string | undefined }) => {
  const { globalNdk } = useGlobalNdk();

  const { group } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const { admins } = useGroupAdmins(groupId);
  const { activeUser } = useActiveUser({ customNdk: globalNdk });
  const { setActiveGroupId } = useActiveGroup();
  const { openLoginModal } = useLoginModalState();
  const { nip29Ndk } = useNip29Ndk();
  const { createNewEvent } = useNewEvent({ customNdk: nip29Ndk });
  const { canEditMetadata, canDeleteGroup } = useGroupAdmin(groupId, activeUser?.pubkey);
  const { toast } = useToast();

  const handleDeleteGroup = (setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!groupId) return;
    deleteGroup(
      activeUser,
      openLoginModal,
      createNewEvent,
      groupId,
      () => {
        toast({ title: 'Success', description: 'Group deleted successfully!' });
        setIsDialogOpen(false);
        setActiveGroupId(undefined);
      },
      () =>
        toast({
          title: 'Error',
          description: 'Failed to delete group!',
          variant: 'destructive',
        }),
    );
    setIsDialogOpen(false);
  };

  return { group, members, admins, canEditMetadata, canDeleteGroup, handleDeleteGroup };
};
